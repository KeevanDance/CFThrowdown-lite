import React from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// actions
import { allDivisions } from '../../actions/divisions'
import { getWorkoutsByDivisionAndGender } from '../../actions/workouts'
import { updateCompetitor } from '../../actions/competitors'

// components
import Competitor from '../../components/Competitor/Competitor'
import CompetitorEditForm from '../../components/Competitor/CompetitorEditForm'


class CompetitorDetailsContainer extends React.Component {

  state = {
    competitor: this.props.competitor || undefined,
    originalGender: this.props.competitor.gender,
    originalDivision: this.props.competitor.division,
    workouts: undefined,
    editMode: false,
    scores: undefined,
    divisionList: [],
  }

  componentWillMount() {
    // get workouts to match data with scores
    const divisionFilter = this.props.navigation.state.params.competitor.division
    const genderFilter = this.props.navigation.state.params.competitor.gender
    let scores = this.props.navigation.state.params.competitor.scores

    allDivisions().then((result) => {
      if (result) {
        const divisionList = Object.keys(result)
        this.setState(() => ({
          divisionList: divisionList
        }))
      }
    })

    if (divisionFilter && genderFilter) {
      this.setState({
        scores: scores,
      }, () => {
        getWorkoutsByDivisionAndGender(divisionFilter, genderFilter).then((res) => {
          if (res) {
            this.setState({
              workouts: res,
            })
          }
        })
      })
    }
  }

  handleEditMode = () => {
    const currentState = this.state.editMode

    if (!this.state.editMode) {
      this.setState((prevState) => ({
        editMode: !prevState.editMode,
      }))
    } else {
      // update scores for the competitor
      let gender = this.state.competitor.gender
      let originalGender = this.state.originalGender
      let division = this.state.competitor.division
      let originalDivision = this.state.originalDivision
      let totalScore = this.state.competitor.totalScore
      const competitorId = this.props.navigation.state.params.competitor.id

      const warning = !gender || !this.state.competitor.firstName || !this.state.competitor.lastName
      // check if we need new workouts due to new gender or division
      if (warning) {
        Alert.alert('Edit Competitor Warning', 'Please make sure the form is filled out correctly')
      } else {
        if (gender !== originalGender || division !== originalDivision) {
          // get workouts of new gender + division
          getWorkoutsByDivisionAndGender(division, gender).then((workoutResult) => {
            let scores = []
            if (workoutResult) {
              let index = -1
              workoutResult.map((workout) => {
                scores[index += 1] = {
                  workoutId: workout.id,
                  points: 0,
                  place: 9999999999,
                }
              })
            }
            let competitor = {
              division: division,
              female: (gender === 'Female'),
              male: (gender === 'Male'),
              firstName: this.state.competitor.firstName,
              lastName: this.state.competitor.lastName,
              scores: scores,
              totalScore: totalScore,
            }
            updateCompetitor(competitorId, competitor)

            this.setState((prevState) => ({
              scores: scores,
              editMode: !prevState.editMode,
            }))
          })
        } else {

          let competitor = {
            division: this.state.competitor.division || '',
            female: (this.state.competitor.gender === 'Female'),
            male: (this.state.competitor.gender === 'Male'),
            firstName: this.state.competitor.firstName,
            lastName: this.state.competitor.lastName,
            scores: this.state.scores || [],
            totalScore: totalScore,
          }

          updateCompetitor(competitorId, competitor)

          // update state with no more edit mode
          this.setState((prevState) => ({
            editMode: !prevState.editMode,
          }))
        }
        this.props.navigation.navigate('AdminHome')
      }
    }
  }

  handleCancel = () => {
    this.setState((prevState) => ({
      editMode: !prevState.editMode,
    }))
  }

  handleScoreEdit = (text, scoreId) => {
    const scoresArr = this.state.scores

    // find the index of the workout we are entering
    const scoreIndex = scoresArr.findIndex((obj => obj.workoutId === scoreId))

    // at that index, change the score to match the new score
    scoresArr[scoreIndex].points = Number(text) || ''


    let competitor = this.state.competitor
    Object.keys(competitor).forEach((key) => {
      if (key === 'scores') {
        competitor[key] = scoresArr
      }
    })
    // set the state
    this.setState({
      competitor: competitor,
      scores: scoresArr,
    })
  }

  handleFirstNameEdit = (text) => {
    const competitor = this.state.competitor
    Object.keys(competitor).forEach((key) => {
      if (key === 'firstName') {
        competitor[key] = text
      }
    })

    this.setState({
      competitor: competitor
    })
  }

  handleLastNameEdit = (text) => {
    const competitor = this.state.competitor
    Object.keys(competitor).forEach((key) => {
      if (key === 'lastName') {
        competitor[key] = text
      }
    })

    this.setState({
      competitor: competitor
    })
  }

  handleGenderCheckbox = (gender) => {
    let competitor = this.state.competitor
    Object.keys(competitor).forEach((key) => {
      if (key === 'gender') {
        competitor[key] = gender
      }
    })
    this.setState({ competitor: competitor })
  }

  handleDivisionChange = (value) => {
    let competitor = this.state.competitor
    Object.keys(competitor).forEach((key) => {
      if (key === 'division') {
        competitor[key] = value
      }
    })
    this.setState(() => ({
      competitor: competitor
    }))
  }

  render() {
    const competitor = this.state.competitor
    const admin = this.props.admin
    const workouts = this.state.workouts
    const scores = this.state.competitor.scores
    const selectedDivision = this.state.division
    const scoresArray = []
    // if there are workouts for this division/gender combination
    // create an array to store them all so we can add points
    if (workouts) {
      const index = -1
      if (scores) {
        this.state.workouts.map((workout) => {
          competitor.scores.map((scoreObj) => {
            Object.keys(scoreObj).forEach((key) => {
              if (workout.id === scoreObj[key]) {
                scoresArray[index += 1] = {
                  name: workout.name,
                  type: workout.type,
                  points: scoreObj['points'] || '',
                  place: scoreObj['place'],
                  id: workout.id
                }
              }
            })
          })
        })
      }
    }

    if (!this.state.editMode && this.state) {
      return (
        <ScrollView>
          <Competitor
            competitor={competitor}
            scores={scoresArray}
            admin={admin}
            handleEditMode={this.handleEditMode}
          />
        </ScrollView>
      )
    } else if (this.state.editMode) {
      const modalData = this.state.divisionList.map((division, index) => {
        return {
          key: index,
          label: division,
        }
      })
      return (
        <KeyboardAwareScrollView extraScrollHeight={100} enableOnAndroid={true}>
          <CompetitorEditForm
            competitor={competitor}
            selectedDivision={selectedDivision}
            modalData={modalData}
            scores={scoresArray}
            handleFirstNameEdit={this.handleFirstNameEdit}
            handleLastNameEdit={this.handleLastNameEdit}
            handleGenderCheckbox={this.handleGenderCheckbox}
            handleDivisionChange={this.handleDivisionChange}
            handleScoreEdit={this.handleScoreEdit}
            handleEditMode={this.handleEditMode}
            handleCancel={this.handleCancel}
          />
        </KeyboardAwareScrollView>
      )
    }
  }

}

export default CompetitorDetailsContainer