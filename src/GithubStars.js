import React from 'react'

class GithubStars extends React.Component {
    state = {
        stars: undefined
    }

    componentDidMount = async () => {
        this.getRepoStars()
    }

    getRepoStars = async () => {
        const response = await fetch(this.props.repo)
        const {stargazers_count} = await response.json()
        this.setState({
            stars: stargazers_count
        })
    }
    render = () => {
        return (
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center '}}>
                <iframe
                    title={'stargazers'}
                    style={{ marginLeft: 28 }}
                    src="https://ghbtns.com/github-btn.html?user=lucasmafra&repo=type-dynamo&type=star&count=true"
                    frameBorder="0" scrolling="0" width="100px"
                    height="20px"></iframe>
                <iframe
                    title={'fork'}
                    src="https://ghbtns.com/github-btn.html?user=lucasmafra&repo=type-dynamo&type=fork&count=true"
                    frameBorder="0" scrolling="0" width="100px"
                    height="20px"></iframe>
            </div>
        )
    }
}

export default GithubStars