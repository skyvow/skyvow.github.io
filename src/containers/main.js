import React from 'react'
import SiderBar from '../components/siderbar'
import Footer from '../components/footer'
import Content from '../components/content'
import Navbar from '../components/navbar'
import resume from '../utils/resume'

class Main extends React.Component {
    componentDidMount() {
        const loading = document.getElementById('loading')
        loading.style.display = 'none'
    }

    render () {
        return (
            <div className="container-fluid" >
                <div className="row main clearfix">
                    <Navbar />
                    <SiderBar {...resume} />
                    <Content {...resume} />
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Main
