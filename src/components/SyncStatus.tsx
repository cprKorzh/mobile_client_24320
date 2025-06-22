import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from './Themed';

interface SyncStatusProps {
  isOnline?: boolean;
  lastSync?: string;
  onSync?: () => void;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ 
  isOnline = true, 
  lastSync, 
  onSync 
}) => {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const getStatusColor = () => {
    return isOnline ? '#4CAF50' : '#FF9800';
  };

  const getStatusText = () => {
    if (isOnline) {
      return lastSync ? `Синхронизировано: ${lastSync}` : 'Онлайн';
    }
    return 'Офлайн режим';
  };

  const getStatusIcon = () => {
    return isOnline ? 'cloud-done' : 'cloud-offline';
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={styles.statusInfo}>
        <Ionicons 
          name={getStatusIcon()} 
          size={16} 
          color={getStatusColor()} 
        />
        <Text style={[styles.statusText, { color: textColor }]}>
          {getStatusText()}
        </Text>
      </View>
      
      {onSync && (
        <TouchableOpacity 
          style={[styles.syncButton, { borderColor: getStatusColor() }]}
          onPress={onSync}
        >
          <Ionicons name="refresh" size={16} color={getStatusColor()} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 8,
  },
  syncButton: {
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
});

export default SyncStatus;
