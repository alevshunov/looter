import * as React from 'react';
import BookIcon from 'material-ui-icons/Book';
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart';
import LocalOfferIcon from 'material-ui-icons/LocalOffer';
import EqualizerIcon from 'material-ui-icons/Assessment';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import { Redirect } from 'react-router';

class MyNavigation extends React.Component<{active: string}, {redirect: string}> {

    private mapNameToIndex = {
        'cards': 0,
        'shops': 1,
        'items': 2,
        'report': 3
    };

    private mapIndexToUrl = {
        0: '/cards/',
        1: '/shops/',
        2: '/items/',
        3: '/report/'
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
                    <BottomNavigationAction label="Выпавшие карты" icon={<BookIcon />} />
                    <BottomNavigationAction label="Открытые магазины" icon={<ShoppingCartIcon />} />
                    <BottomNavigationAction label="Товары" icon={<LocalOfferIcon />} />
                    <BottomNavigationAction label="Статистика" icon={<EqualizerIcon />} />
                </BottomNavigation>
            </div>
        );
    }
}

export default MyNavigation;