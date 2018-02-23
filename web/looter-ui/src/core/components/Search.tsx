import * as React from 'react';
import * as _ from 'underscore';

interface State {
    term: string;
}

interface Props {
    term: string;
    onChanged: (term: string) => void;
}

class Search extends React.Component<Props, State> {

    enqueueOnChange: () => void;

    constructor(props: Props) {
        super(props);

        this.state = {
            term: props.term
        };

        this.handleTerm = this.handleTerm.bind(this);

        this.enqueueOnChange = _.debounce(
            this.onChange,
            500
        );
    }

    componentWillReceiveProps(props: Props) {
        this.setState({ term: props.term });
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        return nextProps.term !== this.state.term || nextState.term !== this.state.term;
    }

    onChange() {
        this.props.onChanged(this.state.term);
    }

    handleTerm(e: { target: { value: string; }; }) {
        this.setState({ term: e.target.value });
        this.enqueueOnChange();
    }

    render() {
        return (
            <div className="input-container">
                <input type="text" placeholder="Поиск" value={this.state.term} onChange={this.handleTerm}/>
            </div>
        );
    }
}

export default Search;
