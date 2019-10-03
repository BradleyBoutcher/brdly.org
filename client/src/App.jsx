import React from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import moment from 'moment';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fullURL: "",               // Website to redirect to
            input: "",                 // Input from text box
            shortURL: "",              // Host URL with base 64 encoded suffix  
            error: "",
            loading: false,
            valid: false,
        }

        this.getFullURL.bind(this);
    }

    /**
     * @description On mounting, determine if we will redirect.
     */
    componentDidMount = () => {
        this.attemptRedirect();
    }

    /**
     * @description Validate user-supplied suffiex in url query parameter
     * @param suffix : A string of characters passed by the user in the url query
     * @returns boolean representing validity of suffix
     */
    isValidSuffix = (suffix) => {
        var regex = new RegExp("^[a-zA-Z0-9]*$");
        return suffix.match(regex) && suffix.length < 7;
    }

    /**
     * @description Validate submitted url to check for unsafe characters
     * @see https://perishablepress.com/stop-using-unsafe-characters-in-urls/
     * @returns boolean representing validity
     * 
     * Note: We do not detect if the URL *works*, only if it contains characters that are unsafe.
     */
    isSafeURL = (url) => {
        var subject = String(url);

        if (subject === "") return false;
        
        // eslint-disable-next-line
        var invalidCharacters = "\"<>#%{}|\ \\^~[]\`".split("");
        
        for (var c of invalidCharacters) {
            if (subject.includes(c)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @description Retrieve the fully-qualified url for redirection purposes
     * @param A : base-64 encoded ID
     */
    getFullURL = (id) => {
        const that = this;
        fetch('https://localhost:4444', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
            }),
        })
        // PARSE
        .then(res => res.json())
        .then(function(data) {
            // ERROR
            if (data.error || !data.full_url) {
                that.setState({
                    error: data.message,
                })
            } else {
                // SUCCESS
                that.setState({
                    fullURL: data.full_url,
                })
            }
        }).finally(() => { 
            if (this.state.fullURL !== "") {
                window.location.href = this.state.fullURL
            }
        })
    }
    
    /**
     * @description If the user passed in a URL query, attempt to 
     *      1. Lookup the associated ID
     *      2. Retrieve the full-url stored with said ID
     *      3. Redirect window to full-url
     */
    attemptRedirect = () => {
        // URL path includes search query, attempt lookup
        if (window.location.search.includes("?")) {
            // Strip query characters 
            let suffix = window.location.search;
            suffix = suffix.replace("/", "").replace("?", "");
            // Detrermine if suffix is valid
            if (suffix !== "" && this.isValidSuffix(suffix)) {
                // Attempt URL Retrieval
                this.getFullURL(suffix);
            }
        }
    }

    /**
     * @description Send a PUT request to create an entry for a new URL
     */
    submit = (e) => {
        e.preventDefault();

        const that = this;

        let {input} = that.state;

        that.setState({loading: true,})
        
        if (!this.isSafeURL(input) || input === "") {
            that.setState({
                error: "URL contains invalid characters, please try again.",
            })
            that.setState({loading: false,})
            return;
        }

        fetch('https://localhost:4444', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_url: that.state.input,
                expiration: moment().add(7, 'days').format("YYYY-MM-DD").toString(),
            }),
        })
        // PARSE
        .then(res => res.json())
        .then(function(data) {
            // ERROR
            if (data.error || !data.short_url) {
                that.setState({
                    error: data.message,
                })
            } else {
                that.setState({
                    shortURL: data.short_url,
                })
            }
        }).catch(
            that.setState({
                error: "There was an error processing your request.",
            })
        ).finally(
            that.setState({
                loading: false,
            })
        )
    }

    /**
     * @description Update the state for a given target name's associated value
     * @param e : An interaction event
     */
    handleInput = (e) => {

        // Determine if input is a safe URL
        this.setState({
            valid: this.isSafeURL(e.target.value)
        })
        
        this.setState({ [e.target.name]: e.target.value});
    }

    /**
     * @description Render our main page, and determine what types of alerts to show.
     */
    render = () => {
        let { input, loading, error, shortURL, valid,} = this.state;
        let alert;
        let loadingComponent;

        // ERROR
        if (error !== "") {
            alert = 
                <Alert key={'alert'} variant={'warning'}>
                    <Alert.Heading>Error</Alert.Heading>
                    <p>
                        {error}
                    </p>
                    <hr/>
                    <div className="d-flex justify-content-end">
                        <Button 
                            onClick={() => {
                                // Clear error
                                this.setState({error: ""})
                                // Clear url query 
                                window.location = "/"
                            }} 
                            variant="outline-success">
                            Close
                        </Button>
                    </div>
                </Alert>;
        }

        // SUCCESS
        if (shortURL !== "") {
            alert = 
                <Alert show={true} variant="success">
                    <Alert.Heading>Success!</Alert.Heading>
                    <p>
                        Your shortened link is: 
                        <a href={shortURL}>
                            <b>{shortURL}</b>
                        </a>
                    </p>
                    <hr/>
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.setState({shortURL: ""})} variant="outline-success">
                            Close
                        </Button>
                    </div>
                </Alert>
        }

        // LOADING - Disable button
        if (loading) { 
            loadingComponent = 
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
        } else {
            loadingComponent = 
                <div>
                    Submit
                </div>
        }

        return (
            <div className="App">
                {alert}
                <h1 className="title"> brdly.org</h1>
                <header className="App-header">
                    <Form
                        noValidate 
                        validated={valid}
                        onSubmit = {this.submit}
                    >
                        <Form.Group>
                            <Form.Label>Enter a link, any link. </Form.Label>
                            <Form.Control 
                                type = "input" 
                                name = {"input"} 
                                value = {input} 
                                onChange = {this.handleInput}
                                placeholder = {" "}
                            />
                        </Form.Group>
                        <Button 
                            variant = "primary" 
                            onClick = {this.submit}
                            disabled = {loading || !valid} >
                            {loadingComponent}
                        </Button>
                    </Form>
                </header>
                <footer className = "footer">
                    © Bradley Boutcher 2019 <br/>
                    <a href = {"https://btboutcher.com"}>btboutcher.com</a>
                </footer>
            </div>
        )
    }
}

export default App;
