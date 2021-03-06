import React from 'react'
import { Button, View } from 'react-native'

// actions
import { allDivisions } from '../../actions/divisions'

// components
import DivisionList from '../../components/Division/DivisionList'


class DivisionContainer extends React.Component {

  state = {
    divisions: undefined,
  }

  componentWillMount() {
    allDivisions().then((res) => {
      if (res) {
        const divisionArr = Object.keys(res)
        this.setState({
          divisions: divisionArr,
        })
      }
    })
  }

  render() {
    const divisions = this.state.divisions
    const admin = this.props.admin
    const navigation = this.props.navigation
    if (divisions) {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <DivisionList
          divisions={divisions}
          navigation={navigation}
          admin={this.props.admin}
        />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Button
            title="Add Division"
            onPress={() => this.props.navigation.navigate('AddDivision')}
          />
        </View>
      )
    }
  }

}

export default DivisionContainer