import * as React from 'react';
import BookIcon from 'material-ui-icons/Book';
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart';
import ViewListIcon from 'material-ui-icons/ViewList';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import { Redirect } from 'react-router';

class MyNavigation extends React.Component<{active: string}, {redirect: string}> {

    private mapNameToIndex = {
        'cards': 0,
        'shops': 1,
        'items': 2,
    };

    private mapIndexToUrl = {
        0: '/cards/',
        1: '/shops/',
        2: '/items/'
    };

    constructor(props: { active: string }, context: any) {
        super(props, context);
        this.state = { redirect: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: any, index: any) {
        this.setState({
            redirect: this.mapIndexToUrl[index]
        });
    }

    render() {
        return (
            <div className="nav">
                {this.state.redirect.length > 0 && <Redirect to={this.state.redirect}/>}
                <BottomNavigation
                    value={this.mapNameToIndex[this.props.active]}
                    showLabels={true}
                    onChange={this.handleChange}
                >
                    <BottomNavigationAction label="Cards" icon={<BookIcon />} />
                    <BottomNavigationAction label="Shops" icon={<ShoppingCartIcon />} />
                    <BottomNavigationAction label="Assortment" icon={<ViewListIcon />} />
                </BottomNavigation>
            </div>
        );
    }
}

export default MyNavigation;