import React from 'react'
import { Button, Text, View } from 'react-native'
import { NavigationActions } from 'react-navigation'

// container
import WorkoutDetailsContainer from '../../containers/WorkoutDetailsContainer'


class WorkoutDetails extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.workout.name,
  })

  render() {
    const navigation = this.props.navigation
    const workout = this.props.navigation.state.params.workout
    return (
      <WorkoutDetailsContainer
        admin={false}
        navigation={navigation}
        workout={workout}
      />
    )
  }
}

export default WorkoutDetails