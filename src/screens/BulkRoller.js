import React from 'react';
import { View } from 'react-native';
import { StyleProvider, Container, Content, Header, Left, Button, Icon, Body, Right, Segment, Text, Title } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import customVariables from '../themes/variables';
import ToHit from './ToHit';
import ToWound from './ToWound';

import { createStackNavigator, createAppContainer,  StackActions, NavigationActions} from "react-navigation";

class HomeScreen extends React.Component {
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    <Text>Home Screen</Text>
                    <Button
                        onPress={() => {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'Details' })
                                ],
                            }))
                        }}
                    ><Text>MyButton</Text></Button>
                </View>
            </StyleProvider>
        );
    }
}

class DetailsScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
            </View>
        );
    }
}


class ToHitScreen extends React.Component {
    render() {
        return (
            <StyleProvider style={getTheme(customVariables)}>
                <Container >
                    <Segment>
                        <Button first active>
                            <Text>Hits</Text>
                        </Button>
                        <Button onPress={() => {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'WoundsScreen' })
                                ],
                            }))
                        }}>
                            <Text>Wounds</Text>
                        </Button>
                        <Button last>
                            <Text>Saves</Text>
                        </Button>
                    </Segment>
                    <Content padder>
                        <ToHit />
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}
class ToWoundScreen extends React.Component {
    render() {
        return (
            <StyleProvider style={getTheme(customVariables)}>
                <Container >
                    <Segment>
                    <Button first onPress={() => {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'HitsScreen' })
                                ],
                            }))
                        }}>
                            <Text>Hits</Text>
                        </Button>
                        <Button active>
                            <Text>Wounds</Text>
                        </Button>
                        <Button last>
                            <Text>Saves</Text>
                        </Button>
                    </Segment>
                    <Content padder>
                        <ToWound />
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}

const AppNavigator = createStackNavigator({
    HitsScreen: {
        screen: ToHitScreen,
    },
    WoundsScreen: {
        screen: ToWoundScreen,
    },
}, {
        initialRouteName: 'HitsScreen',
    });

export default createAppContainer(AppNavigator);
