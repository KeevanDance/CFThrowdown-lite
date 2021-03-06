import React from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { Card } from 'react-native-elements'

// styles
import { typography } from '../../../styles/typography'
import { card } from '../../../styles/card'
import { form } from '../../../styles/form'


class DivisionForm extends React.Component {

  state = {
    textInputFocused: undefined,
  }

  handleNameChange = (text) => {
    this.props.handleNameChange(text)
  }

  handleDivisionSubmit = () => {
    this.props.handleDivisionSubmit()
  }

  handleCancelDivision = () => {
    this.props.handleCancelDivision()
  }

  handleTextInputFocus = (textInput) => {
    this.setState({
      textInputFocused: textInput
    })
  }

  handleTextInputOff = () => {
    this.setState({
      textInputFocused: undefined,
    })
  }

  render() {
    return (
      <View>

        <Card containerStyle={{ padding: 0 }}>

          <View style={card.header}>
            <Text style={[typography.title1, card.title]}>New Division</Text>
          </View>

          <View style={card.content}>
            <View style={form.container}>
              <Text style={typography.footnote}>Name</Text>
              <TextInput
                style={(this.state.textInputFocused === 'name') ? form.focusedTextInput : form.textInput}
                placeholder="RX, Scaled, Masters 35-39, etc..."
                underlineColorAndroid="transparent"
                onFocus={() => this.handleTextInputFocus('name')}
                onEndEditing={() => this.handleTextInputOff()}
                onChangeText={(text) => this.handleNameChange(text)}
              />
            </View>
          </View>

          <View style={form.row}>
            <View style={form.halfContainer}>
              <Button
                onPress={this.handleCancelDivision}
                title="Cancel"
                color="red"
              />
            </View>
            <View style={form.halfContainer}>
              <Button
                onPress={this.handleDivisionSubmit}
                title="Save"
              />
            </View>
          </View>

        </Card>

      </View>
    )
  }
}

export default DivisionForm