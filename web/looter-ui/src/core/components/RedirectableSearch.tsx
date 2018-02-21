import * as React from 'react';
import Search from './Search';
import { Redirect } from 'react-router';

interface State {
    term: string;
    redirect: boolean;
}

interface Props {
    base: string;
    term: string;
}

class RedirectableSearch extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            term: props.term,
            redirect: false
        };

        this.handleTerm = this.handleTerm.bind(this);
    }

    handleTerm(term: string) {
        this.setState({ term, redirect: true });
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        return nextProps.term !== this.state.term || nextState.term !== this.state.term;
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        this.setState({term: nextProps.term, redirect: false});
    }

    render() {
        return (
            <div>
                <Search term={this.state.term} onChanged={this.handleTerm}/>
                {
                    this.state.redirect &&
                    <Redirect
                        to={this.props.base + encodeURIComponent(this.state.term)}
                        push={true}
                    />
                }
            </div>
        );
    }
}

export default RedirectableSearch;
