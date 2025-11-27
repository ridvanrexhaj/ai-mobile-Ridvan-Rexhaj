import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Input, Button, Icon } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { useTheme, lightColors } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows } from '../theme/colors';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
}

const getStyles = (colors: typeof lightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.paper,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.text.secondary,
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
    color: colors.text.primary,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  inputInner: {
    borderBottomWidth: 0,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  saveButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  saveButtonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  signOutButton: {
    borderWidth: 2,
    borderColor: colors.danger.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  signOutButtonContainer: {
    marginTop: spacing.md,
  },
  settingsSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingHint: {
    fontSize: 12,
    marginTop: 2,
    color: colors.text.secondary,
  },
});

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('USD');

  const styles = getStyles(colors);

  const loadProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setCurrency(data.currency || 'USD');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      uploadAvatar(result.assets[0].uri);
    }
  }

  async function uploadAvatar(uri: string) {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      
      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, arrayBuffer, { 
          contentType: `image/${fileExt}`,
          upsert: true 
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      Alert.alert('Success', 'Profile picture updated!');
      loadProfile();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          currency: currency,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      Alert.alert('Success', 'Profile updated!');
      loadProfile();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.main, colors.primary.dark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} disabled={uploading}>
            <View style={styles.avatarContainer}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Icon name="person" type="material" size={60} color={colors.text.secondary} />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <Icon name="camera-alt" type="material" size={16} color="#fff" />
              </View>
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <Input
            placeholder="Enter your name"
            placeholderTextColor={colors.text.disabled}
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<Icon name="person-outline" type="material" size={20} color={colors.text.secondary} />}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputInner}
            inputStyle={{ color: colors.text.primary }}
          />

          <Text style={styles.inputLabel}>Currency</Text>
          <Input
            placeholder="USD"
            placeholderTextColor={colors.text.disabled}
            value={currency}
            onChangeText={setCurrency}
            leftIcon={<Icon name="attach-money" type="material" size={20} color={colors.text.secondary} />}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputInner}
            inputStyle={{ color: colors.text.primary }}
          />

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon name="dark-mode" type="material" size={20} color={colors.primary.main} style={{ marginRight: spacing.md }} />
                <View>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Text style={styles.settingHint}>Toggle app-wide dark theme</Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.background.secondary, true: colors.primary.light }}
                thumbColor={isDark ? colors.primary.main : '#f4f3f4'}
              />
            </View>
          </View>

          <Button
            title="Save Changes"
            onPress={updateProfile}
            loading={loading}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: [colors.primary.main, colors.primary.dark],
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
            }}
            buttonStyle={styles.saveButton}
            containerStyle={styles.saveButtonContainer}
          />

          <Button
            title="Sign Out"
            onPress={handleSignOut}
            type="outline"
            buttonStyle={styles.signOutButton}
            titleStyle={{color: colors.error}}
            containerStyle={styles.signOutButtonContainer}
          />
        </View>
      </ScrollView>
    </View>
  );
}
