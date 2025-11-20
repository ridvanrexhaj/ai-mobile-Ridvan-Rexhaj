import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, AppState, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
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
              <Text style={styles.icon}>💰</Text>
            </View>
            <Text style={styles.title}>Expense Tracker</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create your account to get started' : 'Welcome back! Sign in to continue'}
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.form}>
              <Input
                label="Email Address"
                labelStyle={styles.inputLabel}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="you@example.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ 
                  type: 'material-community', 
                  name: 'email-outline',
                  color: colors.primary.main,
                  size: 22,
                }}
              />
              <Input
                label="Password"
                labelStyle={styles.inputLabel}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Enter your password"
                autoCapitalize="none"
                autoComplete={isSignUp ? 'password-new' : 'password'}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                leftIcon={{ 
                  type: 'material-community', 
                  name: 'lock-outline',
                  color: colors.primary.main,
                  size: 22,
                }}
              />

              <Button
                title={isSignUp ? 'Create Account' : 'Sign In'}
                disabled={loading}
                loading={loading}
                onPress={isSignUp ? signUpWithEmail : signInWithEmail}
                buttonStyle={styles.primaryButton}
                titleStyle={styles.primaryButtonText}
                containerStyle={styles.primaryButtonContainer}
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: [colors.primary.gradient1, colors.primary.gradient2],
                  start: { x: 0, y: 0 },
                  end: { x: 1, y: 0 },
                }}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title={isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                type="clear"
                onPress={() => setIsSignUp(!isSignUp)}
                titleStyle={styles.toggleButtonText}
              />
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
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.inverse,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.xl,
  },
  form: {
    gap: spacing.xs,
  },
  inputLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  input: {
    fontSize: 16,
    color: colors.text.primary,
  },
  primaryButtonContainer: {
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  primaryButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.text.secondary,
    fontSize: 14,
  },
  toggleButtonText: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});
