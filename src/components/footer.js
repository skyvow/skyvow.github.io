import React from 'react'

class Footer extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <section className="col-md-12 card-wrapper">
                <div className="footer">简历模板由 skyvow 设计开发，最后更新于<span className="date">2019-01-10</span></div>
            </section>
        )
    }
}
export default Footer
