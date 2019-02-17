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
      negative: 0,
      alwaysHit: 0,
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
    this.changeNegatives = this.changeNegatives.bind(this);
    this.changeSkill = this.changeSkill.bind(this);
    this.changeRerolls = this.changeRerolls.bind(this);
    this.changeExplodes = this.changeExplodes.bind(this);
    this.changeAlways = this.changeAlways.bind(this);
  }

  changeMaxDice(text) {
    if (text == '') {
      this.setState({ maxDice: 0 });
    } else {
      this.setState({ maxDice: parseInt(text.trim()) });
    }
  }

  colorizeDice() {
    var colors = this.state.colors;
    var skill = (this.state.skill -1);
    var reroll = this.state.reroll;
    var explodes = this.state.explodes;
    var negative = this.state.negative;
    var alwaysHit = this.state.alwaysHit;

    for (x = 0; x < 6; x++) {
      if (x >= (skill + negative)) {
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
          if(negative > 0 && x >= skill)
          {
            colors[x] = 'red';
          } else {
            colors[x] = 'orange';
          }
        }
        if (reroll == "ones" && x == 0) {
          colors[x] = 'orange';
        }
      }
      // final overide of always hit
      if(alwaysHit != 0)
      {
        if(x == 4 && alwaysHit == 5)
        {
          colors[x] = 'blue';
        }
        if(x == 5 && (alwaysHit == 5 || alwaysHit == 6))
        {
          colors[x] = 'blue';
        }
      }
    }
    this.setState({ colors, averageHits: this.calcAverage() });
    
  }

  changeNegatives(text)
  {
    var scope = this;
    let negative = parseInt(text.trim());
    this.setState({ negative }, () => scope.colorizeDice());
  }

  changeSkill(text) {
    var scope = this;
    let skill = parseInt(text.trim());
    this.setState({ skill }, () => scope.colorizeDice());
  }

  changeAlways(text) {
    var scope = this;
    let alwaysHit = parseInt(text.trim());
    this.setState({ alwaysHit }, () => scope.colorizeDice());
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

  calcAverage()
  {
    var skill = (this.state.skill -1);
    var reroll = (this.state.reroll);
    var negative = (this.state.negative);
    var explodes = (this.state.explodes);
    var alwaysHit = (this.state.alwaysHit);

    var retObj1 = this.bigRoll(this.state.maxDice, ["First Roll", "Rerolls"], skill, reroll, negative, explodes, alwaysHit, true);
    if (retObj1.exploded > 0) {
      var retObj2 = this.bigRoll(retObj.exploded, ["Extra Hits", "Reroll Extra Hits"], skill, reroll, negative, explodes, alwaysHit, true);
      retObj1.rolls = [...retObj1.rolls, ...retObj2.rolls];
      retObj1.totalHits = retObj1.totalHits + retObj2.totalHits;
      retObj1.diceRerolled = retObj1.diceRerolled + retObj2.diceRerolled;
      retObj1.convertedMisses = retObj1.convertedMisses + retObj2.convertedMisses;
      for (x = 0; x < 6; x++) {
        retObj1.totals[x] += retObj2.totals[x];
      }
    }

    return retObj1.totalHits;
  }

  roll() {
    this.toggleRollButton();

    var skill = (this.state.skill -1);
    var reroll = (this.state.reroll);
    var negative = (this.state.negative);
    var explodes = (this.state.explodes);
    var alwaysHit = (this.state.alwaysHit);

    var retObj1 = this.bigRoll(this.state.maxDice, ["First Roll", "Rerolls"], skill, reroll, negative, explodes, alwaysHit, false);
    if (retObj1.exploded > 0) {
      var retObj2 = this.bigRoll(retObj.exploded, ["Extra Hits", "Reroll Extra Hits"], skill, reroll, negative, explodes, alwaysHit, false);
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

    setTimeout(() => {
      this.toggleRollButton()
    }, 2000);
  }

  toggleRollButton() {
    this.setState({ rollDisabled: !this.state.rollDisabled });
  }

  bigRoll(diceToRoll, titles, skill, reroll, negative, explodes, alwaysHit, fake) {

    var firstRoll = [];
    if(!fake)
    {
      firstRoll = this.rollDice(diceToRoll);
    } else {
      firstRoll = this.rollFakeDice(diceToRoll);
    }

    let rolls = [];
    rolls.push({ totals: firstRoll, title: titles[0] });

    var firstRollHits = this.calcHits(firstRoll, skill, negative, alwaysHit);

    var secondRollHits = 0;
    var rerollDice = 0;

    let newTotals = [...firstRoll];

    if (skill > 0 && reroll != "none") {
      if (reroll == "misses") {
        for (x = 0; x < skill; x++) {
          rerollDice += newTotals[x];
        }
      } else {
        rerollDice = newTotals[0];
      }

      var rerollTotals = [];
      if(!fake)
      {
        rerollTotals = this.rollDice(rerollDice);
      } else {
        rerollTotals = this.rollFakeDice(rerollDice);
      }
      secondRollHits = this.calcHits(rerollTotals, skill, negative, alwaysHit);
      rolls.push({ totals: rerollTotals, title: rerollDice + " " + titles[1] });


      if (reroll == "misses") {
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
      exploded: this.calcExplodes(newTotals, explodes)
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

  rollFakeDice(totalDice) {
    var average = Math.floor(totalDice / 6);
    var newTotals = [average, average, average, average, average, average];
    return newTotals;
  }

  calcExplodes(newTotals, explodes) {
    if (explodes == "sixes") {
      return newTotals[5];
    }
    if (explodes == "fives") {
      return (newTotals[5] + newTotals[4]);
    }
    return 0;
  }

  calcHits(newTotals, skill, negative, alwaysHit) {

    var included = [];

    var hits = 0;
    for (x = 5; x >= (skill + negative); x--) {
      included.push(x);
      hits += newTotals[x];
    }

    if((alwaysHit == 6 || alwaysHit == 5) && !included.indexOf(5) > -1)
    {
      hits += newTotals[5];
    }
    if(alwaysHit == 5 && !included.indexOf(4) > -1)
    {
      hits += newTotals[4];
    }

    return hits;
  }


  calcOldAverage() {
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

        <View style={styles.diceContainer}>
          <Dice side={1} total={this.state.totals[0]} strokeColor={this.state.colors[0]} />
          <Dice side={2} total={this.state.totals[1]} strokeColor={this.state.colors[1]} />
          <Dice side={3} total={this.state.totals[2]} strokeColor={this.state.colors[2]} />
          <Dice side={4} total={this.state.totals[3]} strokeColor={this.state.colors[3]} />
          <Dice side={5} total={this.state.totals[4]} strokeColor={this.state.colors[4]} />
          <Dice side={6} total={this.state.totals[5]} strokeColor={this.state.colors[5]} />
        </View>

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
        <Item picker>
          <Label>Negative Modifier</Label>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: undefined }}
            placeholder="Please Select"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.negative.toString()}
            onValueChange={this.changeNegatives}
          >
            <Picker.Item label="None" value="0" />
            <Picker.Item label="-1" value="1" />
            <Picker.Item label="-2" value="2" />
            <Picker.Item label="-3" value="3" />
            <Picker.Item label="-4" value="4" />
            <Picker.Item label="-5" value="5" />
            <Picker.Item label="-6" value="6" />
          </Picker>
        </Item>
        <Item picker>
          <Label>Always Hits On</Label>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            style={{ width: undefined }}
            placeholder="Please Select"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.alwaysHit.toString()}
            onValueChange={this.changeAlways}
          >
            <Picker.Item label="Disabled" value="0" />
            <Picker.Item label="6's" value="6" />
            <Picker.Item label="5's" value="5" />
          </Picker>
        </Item>
        <Button block onPress={this.roll} disabled={this.state.rollDisabled}><Text>Roll to Hit</Text></Button>
        <Text>Actual Hits: {this.state.hits}</Text>
        <Text>Converted Misses: {this.state.convertedMisses}</Text>
        <Text>Unconverted Misses: {this.state.diceRerolled - this.state.convertedMisses}</Text>
        <Text>Total Rerolled: {this.state.diceRerolled}</Text>
        
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
