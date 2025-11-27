import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, AppState, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Input } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius, shadows } from '../theme/colors';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    
    if (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    
    if (error) {
      Alert.alert('Error', error.message);
    } else if (!session) {
      Alert.alert('Success', 'Check your inbox for email verification!');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primary.gradient1, colors.primary.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Icon name="wallet" type="material-community" size={40} color="rgba(255,255,255,0.9)" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Expense Tracker</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.background.paper }]}>
            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text.primary }]}>Email</Text>
                <View style={[styles.inputField, { borderBottomColor: colors.border.main }]}>
                  <Icon 
                    name="email-outline" 
                    type="material-community" 
                    size={20}
                    color={colors.text.secondary}
                    style={{ marginRight: spacing.sm }}
                  />
                  <Input
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={[styles.input, { color: colors.text.primary }]}
                    placeholderTextColor={colors.text.disabled}
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text.primary }]}>Password</Text>
                <View style={[styles.inputField, { borderBottomColor: colors.border.main }]}>
                  <Icon 
                    name="lock-outline" 
                    type="material-community" 
                    size={20}
                    color={colors.text.secondary}
                    style={{ marginRight: spacing.sm }}
                  />
                  <Input
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="••••••••"
                    autoCapitalize="none"
                    autoComplete={isSignUp ? 'password-new' : 'password'}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={[styles.input, { color: colors.text.primary }]}
                    placeholderTextColor={colors.text.disabled}
                  />
                </View>
              </View>

              <LinearGradient
                colors={[colors.primary.gradient1, colors.primary.gradient2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <TouchableOpacity
                  onPress={isSignUp ? signUpWithEmail : signInWithEmail}
                  disabled={loading}
                  style={styles.buttonTouch}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity 
                onPress={() => setIsSignUp(!isSignUp)}
                style={styles.toggleButton}
              >
                <Text style={[styles.toggleButtonText, { color: colors.primary.main }]}>
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>
            Secure • Private • Simple
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  formCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  form: {
    gap: spacing.md,
  },
  inputWrapper: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  inputContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    flex: 1,
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
  },
  gradientButton: {
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  buttonTouch: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
