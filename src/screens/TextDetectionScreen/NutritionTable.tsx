import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {NutritionItem} from './TextDetectionScreen';

interface NutritionTableProps {
  data: NutritionItem[];
}

const NutritionTable = ({data}: NutritionTableProps) => (
  <View style={styles.container}>
    <Text style={styles.header}>Nutrition Facts</Text>
    {/* Render the nutrition data */}
    {data && data.length > 0 && (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.amount}</Text>
            <Text style={styles.cell}>
              {item.percentage ? item.percentage : 0}%
            </Text>
          </View>
        )}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default NutritionTable;
