import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Item, Label, Input, Picker, Icon, Button, H1, H2, Text } from 'native-base';
import { Dice } from '../components/Dice';
import { RollResults } from '../components/RollResults';
export default class ToHit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      output: "",
      maxDice: 0,
      totals: [0, 0, 0, 0, 0, 0],
      colors: ['red', 'red', 'green', 'green', 'green', 'green'],
      skill: 3,
      hits: 0,
      averageHits: 0,
      reroll: "none",
      explodes: "none",
      convertedMisses: 0,
      diceRerolled: 0,
      rollDisabled: false,
      rolls: []
    };

    this.changeMaxDice = this.changeMaxDice.bind(this);
    this.roll = this.roll.bind(this);
    this.changeSkill = this.changeSkill.bind(this);
    this.changeRerolls = this.changeRerolls.bind(this);
    this.changeExplodes = this.changeExplodes.bind(this);
  }

  changeMaxDice(text) {
    if (text == '') {
      this.setState({ maxDice: 0 });
    } else {
      this.setState({ maxDice: parseInt(text.trim()) });
    }
  }

  colorizeDice() {
    let colors = this.state.colors;
    skill = this.state.skill;
    reroll = this.state.reroll;
    explodes = this.state.explodes;

    for (x = 0; x < 6; x++) {
      if (x >= (skill - 1)) {
        colors[x] = 'green';
        if (x == 4 && explodes == "fives") {
          colors[x] = 'purple';
        }
        if (x == 5 && (explodes == "fives" || explodes == "sixes")) {
          colors[x] = 'purple';
        }
      } else {
        colors[x] = 'red';
        if (reroll == "misses") {
          colors[x] = 'orange';
        }
        if (reroll == "ones" && x == 0) {
          colors[x] = 'orange';
        }
      }
    }
    this.setState({ colors, averageHits: this.calcAverage() });
    
  }


  changeSkill(text) {
    var scope = this;
    let skill = parseInt(text.trim());
    this.setState({ skill }, () => scope.colorizeDice());
  }

  changeRerolls(text) {
    var scope = this;
    let reroll = text.trim();
    this.setState({ reroll }, () => scope.colorizeDice());
  }

  changeExplodes(text) {
    var scope = this;
    let explodes = text.trim();
    this.setState({ explodes }, () => scope.colorizeDice());

  }

  roll() {
    this.toggleRollButton();



    var retObj1 = this.bigRoll(this.state.maxDice, ["First Roll", "Rerolls"]);
    if (retObj1.exploded > 0) {
      var retObj2 = this.bigRoll(retObj.exploded, ["Extra Hits", "Reroll Extra Hits"]);
      retObj1.rolls = [...retObj1.rolls, ...retObj2.rolls];
      retObj1.totalHits = retObj1.totalHits + retObj2.totalHits;
      retObj1.diceRerolled = retObj1.diceRerolled + retObj2.diceRerolled;
      retObj1.convertedMisses = retObj1.convertedMisses + retObj2.convertedMisses;
      for (x = 0; x < 6; x++) {
        retObj1.totals[x] += retObj2.totals[x];
      }

    }

    this.setState({
      totals: retObj1.totals,
      rolls: retObj1.rolls,
      hits: retObj1.totalHits,
      diceRerolled: retObj1.diceRerolled,
      convertedMisses: retObj1.convertedMisses
    });

    // this.setState({ totals: newTotals, hits: totalHits, rolls, diceRerolled: rerollDice, convertedMisses: secondRollHits });


    setTimeout(() => {
      this.toggleRollButton()
    }, 2000);
  }

  toggleRollButton() {
    this.setState({ rollDisabled: !this.state.rollDisabled });
  }

  bigRoll(diceToRoll, titles) {


    // this.setState({ convertedMisses: 0, diceRerolled: 0, averageHits: Math.round(this.state.maxDice * ((7 - this.state.skill) / 6)) });
    var firstRoll = this.rollDice(diceToRoll);

    let rolls = [];
    rolls.push({ totals: firstRoll, title: titles[0] });

    var skill = (this.state.skill - 1);
    var firstRollHits = this.calcHits(firstRoll, skill);

    var secondRollHits = 0;
    var rerollDice = 0;

    let newTotals = [...firstRoll];

    if (skill > 0 && this.state.reroll != "none") {

      // count dice to reroll

      if (this.state.reroll == "misses") {
        for (x = 0; x < skill; x++) {
          rerollDice += newTotals[x];
        }
      } else {
        rerollDice = newTotals[0];
      }

      var rerollTotals = this.rollDice(rerollDice);
      secondRollHits = this.calcHits(rerollTotals, skill);
      rolls.push({ totals: rerollTotals, title: rerollDice + " " + titles[1] });


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

    var totalHits = firstRollHits + secondRollHits;

    retObj = {
      totalHits: totalHits,
      totals: newTotals,
      rolls: rolls,
      diceRerolled: rerollDice,
      convertedMisses: secondRollHits,
      exploded: this.calcExplodes(newTotals)
    };

    return retObj;
  }

  rollDice(totalDice) {
    newTotals = [0, 0, 0, 0, 0, 0];
    for (x = 0; x < totalDice; x++) {
      var result = Math.floor(Math.random() * 6);
      newTotals[result] = newTotals[result] + 1;
    }
    return newTotals;
  }

  calcExplodes(newTotals) {

    if (this.state.explodes == "sixes") {
      return newTotals[5];
    }
    if (this.state.explodes == "fives") {
      return (newTotals[5] + newTotals[4]);
    }
    return 0;
  }

  calcHits(newTotals, skill) {
    var hits = 0;
    for (x = 5; x >= skill; x--) {
      hits += newTotals[x];
    }
    return hits;
  }

  calcAverage() {
    var dice = this.state.maxDice;
    var skill = this.state.skill;
    var explodes = this.state.explodes;
    var reroll = this.state.reroll;

    var likelyToHit = Math.round(dice * ((7 - skill) / 6));
    var likelyToHitAfterReroll = 0;
    if (reroll != "none") {
      if (reroll == "ones") {
        likelyToHitAfterReroll = Math.round((dice / 6) * ((7 - skill) / 6));
      } else {
        likelyToHitAfterReroll = Math.round((dice - likelyToHit) * ((7 - skill) / 6));
      }
    }

    var extraHits = 0;
    if (explodes != "none") {
      if (explodes == "sixes") {
        extraHits == (dice / 6);
        if(reroll != "none"){
          extraHits += (likelyToHitAfterReroll) / 6;
        }
      } else {
        extraHits == (dice / 3);
        if(reroll != "none"){
          extraHits += (likelyToHitAfterReroll) / 3;
        }
      }
    }

    var explodesLikelyToHit = 0;
    var explodesLikelyToHitAfterReroll = 0;
    if (extraHits > 0) {
      var explodesLikelyToHit = Math.round(extraHits * ((7 - skill) / 6));

      if (reroll != "none") {
        if (reroll == "ones") {
          explodesLikelyToHitAfterReroll = Math.round((extraHits / 6) * ((7 - skill) / 6));
        } else {
          explodesLikelyToHitAfterReroll = Math.round((extraHits - explodesLikelyToHit) * ((7 - skill) / 6));
        }
      }
    }

    var averageHits = likelyToHit + likelyToHitAfterReroll + explodesLikelyToHit + explodesLikelyToHitAfterReroll;
    return averageHits;
  }


  render() {
    return (


      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hits} adjustsFontSizeToFit
          numberOfLines={1}>{this.state.hits} Hits / {this.state.averageHits} Avg.</Text>
        <Item regular>
          <Label>Total Dice</Label>
          <Input value={this.state.maxDice.toString()} keyboardType='number-pad' onChangeText={this.changeMaxDice} />
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

        <Item picker>
          <Label>Generates To Hit</Label>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: undefined }}
            placeholder="Please Select"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.explodes}
            onValueChange={this.changeExplodes}
          >
            <Picker.Item label="None" value="none" />
            <Picker.Item label="On 5+" value="fives" />
            <Picker.Item label="On 6" value="sixes" />
          </Picker>
        </Item>

        <Button block onPress={this.roll} disabled={this.state.rollDisabled}><Text>Roll to Hit</Text></Button>

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

        <RollResults results={this.state.rolls} />


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
