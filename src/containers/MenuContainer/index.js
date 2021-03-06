import React from 'react'
import { StyleSheet, View } from 'react-native'

// firebase actions
import { startSignout } from '../../actions/auth'

// components
import Menu from '../../components/Menu'
import Logo from '../../components/Utility/Logo'


class MenuContainer extends React.Component {

  handleSignout = () => {
    startSignout()
  }

  render() {
    const admin = this.props.admin
    const navigation = this.props.navigation
    return (
      <View style={styles.container}>
        <Logo />
        <Menu
          admin={admin}
          navigation={navigation}
          handleSignout={this.handleSignout}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})

export default MenuContainer