import React, { Fragment } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import { Svg } from 'expo';

export class Dice extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const styles = StyleSheet.create({
            text: {
                color: this.props.strokeColor,
                paddingLeft: 3,
                paddingRight: 3                
            }
        });

        return (
        <Fragment>
            <Svg height={27.5} width={27.5}>
                <Svg.G transform="scale(0.5)">
                    <DiceSide strokeColor={this.props.strokeColor} side={this.props.side}/>
                    <DiceBacking strokeColor={this.props.strokeColor} />
                </Svg.G>
            </Svg>
            <Text style={styles.text}>{this.props.total}</Text>
        </Fragment>);
    }
}


class DiceBacking extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (<Svg.Path fill="none" stroke={this.props.strokeColor} strokeWidth={4} d="M0 0 L0 55 L55 55 L55 0 L0 0" />);
    }
}

class DiceSide extends React.Component{

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