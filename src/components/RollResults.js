import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dice } from './Dice';
import { Text } from 'native-base';
export class RollResults extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {

        if (this.props.results.length > 0) {

            const results = this.props.results.map((result) => (
                <Fragment>
                    <Text>{result.title}</Text>
                    <View style={styles.diceContainer}>
                        <Dice side={1} total={result.totals[0]} strokeColor='black' />
                        <Dice side={2} total={result.totals[1]} strokeColor='black' />
                        <Dice side={3} total={result.totals[2]} strokeColor='black' />
                        <Dice side={4} total={result.totals[3]} strokeColor='black' />
                        <Dice side={5} total={result.totals[4]} strokeColor='black' />
                        <Dice side={6} total={result.totals[5]} strokeColor='black' />
                    </View>
                </Fragment>
            ));

            return (<Fragment>{results}</Fragment>);

        } else {
            return (<Text>No History</Text>);
        }
    }

}
const styles = StyleSheet.create({
    diceContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'space-between'
    },
});