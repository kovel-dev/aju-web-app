import React, { Component } from 'react'
import Image from 'next/image'

export class Logo extends Component {
  render() {
    return (
      <div className="mx-auto">
        <Image
          className="text-center"
          src="/assets/images/maven_logo.jpg"
          alt="Maven Logo"
          width="200"
          height="80"
        />
      </div>
    )
  }
}

export default Logo
