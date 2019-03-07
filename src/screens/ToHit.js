import React from 'react';
import { StyleSheet, View, ScrollView, Picker as NativePicker } from 'react-native';

import { Item, Label, Input, Picker, Icon, Button, Text, Content, Grid, Col } from 'native-base';
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
      diceIcons: [
        {
          hit: false,
          reroll: false,
          explodes: false,
          alwaysHit: false,
        }, {
          hit: false,
          reroll: false,
          explodes: false,
          alwaysHit: false,
        }, {
          hit: true,
          reroll: false,
          explodes: false,
          alwaysHit: false,
        }, {
          hit: true,
          reroll: false,
          explodes: false,
          alwaysHit: false,
        }, {
          hit: true,
          reroll: false,
          explodes: false,
          alwaysHit: false,
        }, {
          hit: true,
          reroll: false,
          explodes: false,
          alwaysHit: false,
        },
      ],
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
      rolls: [],
      spinOnChange: false,
    };

    this.changeMaxDice = this.changeMaxDice.bind(this);
    this.roll = this.roll.bind(this);
    this.toggleRollButton = this.toggleRollButton.bind(this);
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

  setDiceIcons() {
    var skill = (this.state.skill - 1);
    var reroll = this.state.reroll;
    var explodes = this.state.explodes;
    var negative = this.state.negative;
    var alwaysHit = this.state.alwaysHit;

    var newIcons = [];




    for (x = 0; x < 6; x++) {

      var diceIcons = {
        hit: false,
        reroll: false,
        explodes: false,
        alwaysHit: false,
      };

      if (x >= (skill + negative)) {
        diceIcons.hit = true;
        if (x == 4 && explodes == "fives") {
          diceIcons.explodes = true;
        }
        if (x == 5 && (explodes == "fives" || explodes == "sixes")) {
          diceIcons.explodes = true;
        }
      } else {
        diceIcons.hit = false;
        if (reroll == "misses") {
          if (negative > 0 && x >= skill) {
            diceIcons.hit = false;
          } else {
            diceIcons.reroll = true;
          }
        }
        if (reroll == "ones" && x == 0) {
          diceIcons.reroll = true;
        }
      }
      // final overide of always hit
      if (alwaysHit != 0) {
        if (x == 4 && alwaysHit == 5) {
          diceIcons.hit = true;
          diceIcons.alwaysHit = true;
        }
        if (x == 5 && (alwaysHit == 5 || alwaysHit == 6)) {
          diceIcons.hit = true;
          diceIcons.alwaysHit = true;
        }
      }


      newIcons.push(diceIcons);

    }

    this.setState({ diceIcons: newIcons });
  }

  colorizeDice() {
    this.setDiceIcons();
  }

  changeNegatives(text) {
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

  calcAverage() {
    var skill = (this.state.skill - 1);
    var reroll = (this.state.reroll);
    var negative = (this.state.negative);
    var explodes = (this.state.explodes);
    var alwaysHit = (this.state.alwaysHit);
    let diceIcons = Object.assign({}, this.state.diceIcons);

    var retObj1 = this.bigRoll(this.state.maxDice, ["First Roll", "Rerolls"], skill, reroll, negative, explodes, alwaysHit, true, diceIcons);
    if (retObj1.exploded > 0) {
      var retObj2 = this.bigRoll(retObj.exploded, ["Extra Hits", "Reroll Extra Hits"], skill, reroll, negative, explodes, alwaysHit, true, diceIcons);
      retObj1.rolls = [...retObj1.rolls, ...retObj2.rolls];
      retObj1.totalHits = retObj1.totalHits + retObj2.totalHits;
      retObj1.diceRerolled = retObj1.diceRerolled + retObj2.diceRerolled;
      retObj1.convertedMisses = retObj1.convertedMisses + retObj2.convertedMisses;
      for (x = 0; x < 6; x++) {
        retObj1.totals[x] += retObj2.totals[x];
      }
    }

    return Math.round(retObj1.totalHits);
  }

  roll() {
    this.toggleRollButton();

    var skill = (this.state.skill - 1);
    var reroll = (this.state.reroll);
    var negative = (this.state.negative);
    var explodes = (this.state.explodes);
    var alwaysHit = (this.state.alwaysHit);
    let diceIcons = Object.assign({}, this.state.diceIcons);

    var retObj1 = this.bigRoll(this.state.maxDice, ["First Roll", "Rerolls"], skill, reroll, negative, explodes, alwaysHit, false, diceIcons);
    if (retObj1.exploded > 0) {
      var retObj2 = this.bigRoll(retObj.exploded, ["Extra Hits", "Reroll Extra Hits"], skill, reroll, negative, explodes, alwaysHit, false, diceIcons);
      retObj1.rolls = [...retObj1.rolls, ...retObj2.rolls];
      retObj1.totalHits = retObj1.totalHits + retObj2.totalHits;
      retObj1.diceRerolled = retObj1.diceRerolled + retObj2.diceRerolled;
      retObj1.convertedMisses = retObj1.convertedMisses + retObj2.convertedMisses;
      for (x = 0; x < 6; x++) {
        retObj1.totals[x] += retObj2.totals[x];
      }
    }

    this.setState({
      spinOnChange: true,
      totals: retObj1.totals,
      rolls: retObj1.rolls,
      hits: retObj1.totalHits,
      diceRerolled: retObj1.diceRerolled,
      convertedMisses: retObj1.convertedMisses,
    });

    setTimeout(() => {
      this.toggleRollButton()
    }, 2000);
  }

  toggleRollButton() {
    this.setState({
      rollDisabled: !this.state.rollDisabled,
      spinOnChange: false
    });
  }

  bigRoll(diceToRoll, titles, skill, reroll, negative, explodes, alwaysHit, fake, diceIcons) {

    // let firstRollIcons = Object.assign({}, diceIcons);


    var firstRoll = [];
    if (!fake) {
      firstRoll = this.rollDice(diceToRoll);
    } else {
      firstRoll = this.rollFakeDice(diceToRoll);
    }

    let rolls = [];
    rolls.push({ totals: firstRoll, rollIcons: diceIcons, title: titles[0] });

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
      if (!fake) {
        rerollTotals = this.rollDice(rerollDice);
      } else {
        rerollTotals = this.rollFakeDice(rerollDice);
      }
      secondRollHits = this.calcHits(rerollTotals, skill, negative, alwaysHit);

      // let secondRollIcons = Object.assign({}, diceIcons);
      // for(x=0;x<6;x++)
      // {
      //   secondRollIcons[x].reroll = false;
      // }


      rolls.push({ totals: rerollTotals, rollIcons: diceIcons, title: rerollDice + " " + titles[1] });


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
      exploded: this.calcExplodes(newTotals, explodes),
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
    var average = totalDice / 6;
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

    if ((alwaysHit == 6 || alwaysHit == 5) && !included.includes(5)) {
      hits += newTotals[5];
    }
    if (alwaysHit == 5 && !included.includes(4)) {
      hits += newTotals[4];
    }

    return hits;
  }

  render() {
    return (
      <Content>
        <Text style={styles.hits} adjustsFontSizeToFit
          numberOfLines={1}>{this.state.hits} Hits / {this.state.averageHits} Avg.</Text>

        <Grid>
          <Col><Dice spinOnChange={this.state.spinOnChange} side={1} total={this.state.totals[0]} diceIcons={this.state.diceIcons[0]} /></Col>
          <Col><Dice spinOnChange={this.state.spinOnChange} side={2} total={this.state.totals[1]} diceIcons={this.state.diceIcons[1]} /></Col>
          <Col><Dice spinOnChange={this.state.spinOnChange} side={3} total={this.state.totals[2]} diceIcons={this.state.diceIcons[2]} /></Col>
          <Col><Dice spinOnChange={this.state.spinOnChange} side={4} total={this.state.totals[3]} diceIcons={this.state.diceIcons[3]} /></Col>
          <Col><Dice spinOnChange={this.state.spinOnChange} side={5} total={this.state.totals[4]} diceIcons={this.state.diceIcons[4]} /></Col>
          <Col><Dice spinOnChange={this.state.spinOnChange} side={6} total={this.state.totals[5]} diceIcons={this.state.diceIcons[5]} /></Col>
        </Grid>



        <Grid>

          <Col>
            <Item>
              <Label>Total Dice</Label>
              <Input value={this.state.maxDice.toString()} keyboardType='number-pad' onChangeText={this.changeMaxDice} />
            </Item>
          </Col>
          <Col>
            <Item picker>
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
                <Picker.Item label="WS/BS 2" value="2" />
                <Picker.Item label="WS/BS 3" value="3" />
                <Picker.Item label="WS/BS 4" value="4" />
                <Picker.Item label="WS/BS 5" value="5" />
                <Picker.Item label="WS/BS 6" value="6" />
              </Picker>
            </Item>
          </Col>

        </Grid>


        <Grid>
          <Col>
            <Item picker>
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
                <Picker.Item label="Reroll 1's" value="ones" />
                <Picker.Item label="Reroll Misses" value="misses" />
              </Picker>
            </Item>
          </Col>
          <Col>
            <Item picker>
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
                <Picker.Item label="No Explode" value="none" />
                <Picker.Item label="Explode on 5+" value="fives" />
                <Picker.Item label="Explode on 6's" value="sixes" />
              </Picker>
            </Item>

          </Col>
        </Grid>

        <Grid>
          <Col>
            <Item picker>
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
                <Picker.Item label="No Negatives" value="0" />
                <Picker.Item label="-1 to Hit" value="1" />
                <Picker.Item label="-2 to Hit" value="2" />
                <Picker.Item label="-3 to Hit" value="3" />
                <Picker.Item label="-4 to Hit" value="4" />
                <Picker.Item label="-5 to Hit" value="5" />
                <Picker.Item label="-6 to Hit" value="6" />
              </Picker>
            </Item>
          </Col>
          <Col>
            <Item picker>
              <Picker
                mode="dialog"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Please Select"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.alwaysHit.toString()}
                onValueChange={this.changeAlways}
              >
                <Picker.Item label="No Always Hit" value="0" />
                <Picker.Item label="Always on 6's" value="6" />
                <Picker.Item label="Always on 5's" value="5" />
              </Picker>
            </Item>
          </Col>
        </Grid>

        <Button onPress={() => this.roll()} disabled={this.state.rollDisabled}><Text>Roll to Hit</Text></Button>

        <Text>Actual Hits: {this.state.hits}</Text>
        <Text>Converted Misses: {this.state.convertedMisses}</Text>
        <Text>Unconverted Misses: {this.state.diceRerolled - this.state.convertedMisses}</Text>
        <Text>Total Rerolled: {this.state.diceRerolled}</Text>

        <RollResults results={this.state.rolls} />
      </Content>
    );
  }
}



const styles = StyleSheet.create({
  hits: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0E75A7',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'stretch',
  },
  diceContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between',
  },
  controlsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  item: {
    width: '50%',
  },
  slimItem: {
    width: '33%',
  },
});
