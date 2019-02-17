import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Item, Label, Input, Picker, Icon, Button, H1, H2, Text } from 'native-base';
import { Dice } from '../components/Dice';
import { RollResults } from '../components/RollResults';
export default class ToWound extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
      return (
        <ScrollView contentContainerStyle={styles.content}>
            <Text>This is the to wound page</Text>
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
    hits: {
      fontSize: 20,
  
      fontWeight: 'bold',
      color: 'green'
    },
    content: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'stretch'
    },
    diceContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'space-between'
    },
  });