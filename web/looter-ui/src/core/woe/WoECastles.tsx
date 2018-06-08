import * as React from 'react';
import './WoECastles.css';
import Container from '../components/Container';
import WoECastlesState from './components/WoECastlesState';
import GA from '../extra/GA';

class WoECastles extends React.Component {

    render() {
        document.title = 'FreeRO - WoE - Замки';
        GA();

        return (
            <div className="area-woe-castles">
                <Container>
                    <WoECastlesState/>
                </Container>
            </div>
        );
    }
}

export default WoECastles;