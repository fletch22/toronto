import React from 'react'
import Header from 'js/header'
import Footer from 'js/footer'

import 'css/modules/container'

const Container = React.createClass({
  render () {
    return (
      <div className='container'>
        <Header />
        Peach
        <Footer />
      </div>
    )
  }
})

export default Container
