import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Item, Label, Input, Picker, Icon, Button } from 'native-base';
import { Dice } from './components/Dice';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { store, persistor } from './redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// This is used in order to see requests on the Chrome DevTools
XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;

// App debug settings
console.disableYellowBox = true;


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      output: "",
      maxDice: 0,
      totals: [0, 0, 0, 0, 0, 0],
      colors: ['red','red','green','green','green','green'],
      skill: 3,
      hits: 0,
      averageHits: 0,
      reroll: "none",
      convertedMisses: 0,
      diceRerolled: 0,
      rollDisabled: false
    };

    this.changeMaxDice = this.changeMaxDice.bind(this);
    this.roll = this.roll.bind(this);
    this.changeSkill = this.changeSkill.bind(this);
    this.changeRerolls = this.changeRerolls.bind(this);
  }

  changeMaxDice(text) {
    if (text == '') {
      this.setState({ maxDice: 0 });
    } else {
      this.setState({ maxDice: parseInt(text.trim()) });
    }
  }

  colorizeDice(skill, reroll)
  {
    let colors = this.state.colors;

    for(x=0;x<6;x++)
    {
      if(x >= (skill -1))
      {
        colors[x] = 'green';
      } else {
        colors[x] = 'red';
        if(reroll == "misses"){
          colors[x] = 'orange';
        }
        if(reroll == "ones" && x == 0)
        {
          colors[x] = 'orange';
        }
      } 
    }
    this.setState({ colors });
  }
  

  changeSkill(text) {
    let skill = parseInt(text.trim());
    this.setState({ skill });
    this.colorizeDice(skill, this.state.reroll);
  }

  changeRerolls(text) {
    let reroll = text.trim();
    this.setState({ reroll });
    this.colorizeDice(this.state.skill, reroll);
  }


  roll() {

    this.setState({ rollDisabled: true });
    this.setState({ convertedMisses: 0 });
    this.setState({ diceRerolled: 0 });

    this.setState({ averageHits: Math.round(this.state.maxDice * ((7 - this.state.skill) / 6)) });
    var newTotals = this.rollDice(this.state.maxDice);
    var skill = (this.state.skill - 1);
    var firstRollHits = this.calcHits(newTotals, skill);
    var secondRollHits = 0;

    if (skill > 0 && this.state.reroll != "none") {

      // count dice to reroll
      var rerollDice = 0;
      if (this.state.reroll == "misses") {
        for (x = 0; x < skill; x++) {
          rerollDice += newTotals[x];
        }
      } else {
        rerollDice = newTotals[0];
      }

      var rerollTotals = this.rollDice(rerollDice);
      this.setState({ diceRerolled: rerollDice });
      var secondRollHits = this.calcHits(rerollTotals, skill);
      this.setState({ convertedMisses: secondRollHits });

      if (this.state.reroll == "misses") {
        for (x = 0; x < 6; x++) {
          if (x < skill) {
            newTotals[x] = rerollTotals[x];
          } else {
            newTotals[x] += rerollTotals[x];
          }
        }
      } else {
        newTotals[0] = rerollTotals[0];
        for (x = 1; x < 6; x++) {
          newTotals[x] += rerollTotals[x];
        }
      }
    }

    this.setState({ totals: newTotals });
    this.setState({ hits: (firstRollHits + secondRollHits) });
    setTimeout(() => {
      this.setState({ rollDisabled: false })
    }, 2000);

  }

  rollDice(totalDice) {
    newTotals = [0, 0, 0, 0, 0, 0];
    for (x = 0; x < totalDice; x++) {
      var result = Math.floor(Math.random() * 6);
      newTotals[result] = newTotals[result] + 1;
    }
    return newTotals;
  }

  calcHits(newTotals, skill) {
    var hits = 0;
    for (x = 5; x >= skill; x--) {
      hits += newTotals[x];
    }
    return hits;
  }


  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={styles.content}>
            <Item inlineLabel>
              <Label>Total Dice</Label>
              <Input value={this.state.maxDice.toString()} keyboardType='numeric' onChangeText={this.changeMaxDice} />
            </Item>
            <Item picker>
              <Label>WS/BS</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Please Select"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.skill.toString()}
                onValueChange={this.changeSkill}
              >
                <Picker.Item label="1 (Cheater)" value="1" />
                <Picker.Item label="2 (Hero)" value="2" />
                <Picker.Item label="3 (Space Marine)" value="3" />
                <Picker.Item label="4 (Grots)" value="4" />
                <Picker.Item label="5 (Orks)" value="5" />
                <Picker.Item label="6 (Give Up)" value="6" />
              </Picker>
            </Item>

            <Item picker>
              <Label>Reroll</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Please Select"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.reroll}
                onValueChange={this.changeRerolls}
              >
                <Picker.Item label="No Rerolls" value="none" />
                <Picker.Item label="1's" value="ones" />
                <Picker.Item label="All Misses" value="misses" />
              </Picker>
            </Item>




              <Text>Average Hits: {this.state.averageHits}</Text>

            <Button onPress={this.roll} disabled={this.state.rollDisabled}><Text>Roll to Hit</Text></Button>

            <Text>Actual Hits: {this.state.hits}</Text>
            <Text>Converted Misses: {this.state.convertedMisses}</Text>
            <Text>Unconverted Misses: {this.state.diceRerolled - this.state.convertedMisses}</Text>
            <Text>Total Rerolled: {this.state.diceRerolled}</Text>
            <View style={styles.diceContainer}>
              <Dice side={1} total={this.state.totals[0]} strokeColor={this.state.colors[0]} />
              <Dice side={2} total={this.state.totals[1]} strokeColor={this.state.colors[1]} />
              <Dice side={3} total={this.state.totals[2]} strokeColor={this.state.colors[2]} />
              <Dice side={4} total={this.state.totals[3]} strokeColor={this.state.colors[3]} />
              <Dice side={5} total={this.state.totals[4]} strokeColor={this.state.colors[4]} />
              <Dice side={6} total={this.state.totals[5]} strokeColor={this.state.colors[5]} />
            </View>
          </View>

        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
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
