import React from 'react'
import classNames from 'classnames'

class Navbar extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            isOpen: false,
        }
    }

    handlerClick = (e) => {
        const { isOpen } = this.state
        this.setState({
            isOpen: !isOpen,
        })
    }

    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            const anchorElement = document.getElementById(anchorName)
            if(anchorElement) {
                anchorElement.scrollIntoView()
                this.setState({
                    isOpen: false,
                })
            }
        }
    }

    render () {
        const { isOpen } = this.state
        const btncls = classNames({
            'js-floating-nav-trigger': true,
            'floating-nav-trigger': true,
            'is-open': isOpen,
        })
        const navcls = classNames({
            'floating-nav': true,
            'js-floating-nav': true,
            'is-visible': isOpen,
        })

        return (
            <section className="col-md-12 nav-card-wrapper">
                <a className={btncls} href="javascript:;" onClick={this.handlerClick}>
                    <i className="icon-bars"></i>
                    <span className="close-icon">×</span>
                </a>
                <a className={btncls} href="javascript:;" onClick={this.props.renderHTMLtoPDF} style={{ bottom: '80px' }}>
                    <i className="glyphicon glyphicon-download-alt" style={{ lineHeight: '50px' }}></i>
                </a>
                <nav className={navcls}>
                    <ul className="list-unstyled">
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('about')}><i className="mr-10 icon-board"></i>自我描述</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('work-experience')}><i className="mr-10 icon-office"></i>工作经历</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('education')}><i className="mr-10 icon-graduation-cap"></i>教育经历</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('project-experience')}><i className="mr-10 icon-child"></i>项目经验</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('publications')}><i className="mr-10 icon-newspaper"></i>作品展示</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('skills')}><i className="mr-10 icon-tools"></i>技能评价</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('awards')}><i className="mr-10 icon-trophy"></i>荣誉证书</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('interests')}><i className="mr-10 icon-heart"></i>兴趣爱好</a></li>
                        <li><a href="javascript:;" onClick={() => this.scrollToAnchor('references')}><i className="mr-10 icon-thumbs-up"></i>座右铭</a></li>
                    </ul>
                </nav>
            </section>
        )
    }
}

export default Navbar
