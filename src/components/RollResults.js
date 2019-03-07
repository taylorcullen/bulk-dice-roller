import React, { Fragment } from 'react';
import { Dice } from './Dice';
import { Text, Grid, Col } from 'native-base';
export class RollResults extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.results.length > 0) {
            const results = this.props.results.map((result) => (
                <Fragment>
                    <Text>{result.title}</Text>
                    <Grid>
                        <Col><Dice spinOnChange={false} side={1} total={result.totals[0]} diceIcons={result.rollIcons[0]} /></Col>
                        <Col><Dice spinOnChange={false} side={2} total={result.totals[1]} diceIcons={result.rollIcons[1]} /></Col>
                        <Col><Dice spinOnChange={false} side={3} total={result.totals[2]} diceIcons={result.rollIcons[2]} /></Col>
                        <Col><Dice spinOnChange={false} side={4} total={result.totals[3]} diceIcons={result.rollIcons[3]} /></Col>
                        <Col><Dice spinOnChange={false} side={5} total={result.totals[4]} diceIcons={result.rollIcons[4]} /></Col>
                        <Col><Dice spinOnChange={false} side={6} total={result.totals[5]} diceIcons={result.rollIcons[5]} /></Col>
                    </Grid>
                </Fragment>
            ));
            return (<Fragment>{results}</Fragment>);
        } else {
            return (<Text>No History</Text>);
        }
    }
}