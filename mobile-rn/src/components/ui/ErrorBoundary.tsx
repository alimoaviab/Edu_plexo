import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { colors, radius, spacing, typography, shadows } from '@/theme/tokens';
import { Icon } from '@/components/ui/Icon';
import { useAuthStore } from '@/store/auth-store';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught an unhandled error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleSignOut = async () => {
    try {
      await useAuthStore.getState().logout();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={[styles.card, shadows.floating]}>
            <View style={styles.iconWrap}>
              <Icon name="alert-triangle" size={32} color={colors.error} />
            </View>

            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred in the application. You can try refreshing the view or signing out.
            </Text>

            {this.state.error ? (
              <ScrollView style={styles.errorBox} contentContainerStyle={styles.errorBoxContent}>
                <Text style={styles.errorText}>
                  {this.state.error.message || String(this.state.error)}
                </Text>
              </ScrollView>
            ) : null}

            <View style={styles.buttonRow}>
              <Pressable
                onPress={this.handleReset}
                style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </Pressable>

              <Pressable
                onPress={this.handleSignOut}
                style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}
              >
                <Text style={styles.signOutButtonText}>Sign Out & Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl2,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.gray900,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  errorBox: {
    maxHeight: 120,
    width: '100%',
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  errorBoxContent: {
    padding: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    fontFamily: 'monospace',
  },
  buttonRow: {
    width: '100%',
    gap: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  retryButtonText: {
    ...typography.bodyMd,
    color: colors.white,
    fontWeight: '700',
  },
  signOutButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  signOutButtonText: {
    ...typography.bodyMd,
    color: colors.gray700,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
