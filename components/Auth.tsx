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

  function showHelp() {
    const helpText = isSignUp 
      ? 'Create a new account with your email and password to start tracking your expenses.'
      : 'Sign in with your email and password to access your expense tracker.';
    Alert.alert('Help', helpText, [{ text: 'Got it', style: 'default' }]);
  }

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
          <View style={styles.topSection}>
            <TouchableOpacity 
              onPress={showHelp}
              style={styles.helpButton}
            >
              <View style={styles.helpIconBg}>
                <Text style={styles.helpIcon}>?</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.05)']}
                style={styles.iconBg}
              >
                <Icon name="wallet-multiple" type="material-community" size={48} color="white" />
              </LinearGradient>
            </View>
            <Text style={styles.mainTitle}>Expense Tracker</Text>
            <Text style={styles.mainSubtitle}>
              {isSignUp ? 'Join and start tracking' : 'Track every expense'}
            </Text>
          </View>

          <View style={[styles.contentCard, { backgroundColor: colors.background.paper }]}>
            <Text style={[styles.formTitle, { color: colors.text.primary }]}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>

            <View style={styles.formGroup}>
              <View style={styles.inputBox}>
                <Icon 
                  name="email-outline" 
                  type="material-community" 
                  size={18}
                  color={colors.primary.main}
                />
                <Input
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  placeholder="Email address"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={[styles.input, { color: colors.text.primary }]}
                  placeholderTextColor={colors.text.disabled}
                />
              </View>

              <View style={styles.inputBox}>
                <Icon 
                  name="lock-outline" 
                  type="material-community" 
                  size={18}
                  color={colors.primary.main}
                />
                <Input
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Password"
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
              style={styles.submitButton}
            >
              <TouchableOpacity
                onPress={isSignUp ? signUpWithEmail : signInWithEmail}
                disabled={loading}
                style={styles.submitButtonInner}
              >
                <Icon 
                  name={isSignUp ? "account-plus" : "login"} 
                  type="material-community" 
                  size={20}
                  color="white"
                  style={{ marginRight: spacing.sm }}
                />
                <Text style={styles.submitButtonText}>
                  {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.divider} />

            <TouchableOpacity 
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.toggleLink}
            >
              <Text style={[styles.toggleText, { color: colors.text.secondary }]}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                {' '}
              </Text>
              <Text style={[styles.toggleTextHighlight, { color: colors.primary.main }]}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>Secure • Private • Simple</Text>
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
  topSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl + spacing.lg,
    position: 'relative',
  },
  helpButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  helpIconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  helpIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  iconWrapper: {
    marginBottom: spacing.lg,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '400',
  },
  contentCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  inputContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: spacing.sm,
    flex: 1,
  },
  input: {
    fontSize: 15,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  submitButtonInner: {
    paddingVertical: spacing.md + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: spacing.lg,
  },
  toggleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '400',
  },
  toggleTextHighlight: {
    fontSize: 14,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
  },
});
