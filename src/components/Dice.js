import React, { Fragment } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, Icon } from 'native-base';
import { Svg } from 'expo';

export class Dice extends React.Component {

    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0);
        this.spin = this.spin.bind(this);
    }

    componentDidUpdate() {
        if (this.props.spinOnChange) {
            this.spin();
        }
    }

    spin() {
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue: 360,
                duration: 250,
                easing: Easing.linear,
                useNativeDriver: true,
            }
        ).start()
    }

    render() {

        const strokeColor = this.props.diceIcons.hit ? 'green' : 'red';

        const styles = StyleSheet.create({
            text: {
                color: strokeColor,
                textAlign: 'center',
            },
            dice: {
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'stretch',
            }
        });

        const spin = this.spinValue.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        });

        return (
            <Fragment>
                <Animated.View style={[{ transform: [{ rotate: spin }] }, styles.dice]}>
                    <Svg height={27.5} width={27.5}>
                        <Svg.G transform="scale(0.5)">
                            <DiceSide strokeColor={strokeColor} side={this.props.side} />
                            <DiceBacking strokeColor={strokeColor} />
                        </Svg.G>
                    </Svg>
                </Animated.View>
                {this.props.diceIcons != null ? <DiceIcons diceIcons={this.props.diceIcons} /> : <Fragment/>}
                <Text style={styles.text}>{this.props.total}</Text>
            </Fragment>);
    }
}

class DiceIcons extends React.Component {
    render() {

        const styles = StyleSheet.create({
            iconHolder: {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            },
            icon: {
                fontSize: 10,
            },
            explodes: {
                color: 'red',
            },
            hit: {
                color: 'green',
            },
            reroll: {
                color: 'orange',
            },
        });

        return (
            <View style={styles.iconHolder}>
                {this.props.diceIcons.hit ? <Icon style={[styles.icon, styles.hit]} name='target' type='MaterialCommunityIcons' /> : <Fragment />}
                {this.props.diceIcons.reroll ? <Icon style={[styles.icon, styles.reroll]} name='repeat' type='MaterialCommunityIcons' /> : <Fragment />}
                {this.props.diceIcons.explodes ? <Icon style={[styles.icon, styles.explodes]} name='fire' type='MaterialCommunityIcons' /> : <Fragment />}
                {this.props.diceIcons.alwaysHit ? <Icon style={[styles.icon, styles.explodes]} name='target' type='MaterialCommunityIcons' /> : <Fragment />}
            </View>
        );
    }
}

class DiceBacking extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<Svg.Path fill="none" stroke={this.props.strokeColor} strokeWidth={4} d="M0 0 L0 55 L55 55 L55 0 L0 0" />);
    }
}

class DiceSide extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        switch (this.props.side) {
            case 1:
                return (
                    <Fragment>
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={27.9} cy={27.9} r={5.7} />
                    </Fragment>);
            case 2:
                return (
                    <Fragment>
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={40} cy={40} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={15.7} cy={15.7} r={5.7} />
                    </Fragment>);
            case 3:
                return (
                    <Fragment>
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={44} cy={44} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={11.7} cy={11.7} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={27.9} cy={27.9} r={5.7} />
                    </Fragment>);
            case 4:
                return (
                    <Fragment>
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={40} cy={40} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={15.7} cy={40} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={40} cy={15.7} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={15.7} cy={15.7} r={5.7} />
                    </Fragment>);
            case 5:
                return (
                    <Fragment>
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={44} cy={44} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={11.7} cy={44} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={44} cy={11.7} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={11.7} cy={11.7} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={27.9} cy={27.9} r={5.7} />
                    </Fragment>);
            case 6:
                return (
                    <Fragment>
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={11.7} cy={40} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={27.9} cy={40} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={44} cy={40} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={11.7} cy={15.7} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={27.9} cy={15.7} r={5.7} />
                        <Svg.Circle fill={this.props.strokeColor} stroke={this.props.strokeColor} strokeWidth={0.5} cx={44} cy={15.7} r={5.7} />
                    </Fragment>);
            default:
                return (<Fragment>
                    <DiceBacking />
                </Fragment>);

        }
    }
}