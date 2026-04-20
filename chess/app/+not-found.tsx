import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function NotFoundScreen() {
  const suggestions = [
    { title: 'Quick Play', route: '/', icon: '⚡' },
    { title: 'Join with Code', route: '/', icon: '🔑' },
    { title: 'Play vs Computer', route: '/game/computer', icon: '🤖' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with chess theme */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>♜ ♞ ♝ ♛ ♚ ♔ ♕ ♗ ♘ ♖</Text>
      </View>
      
      {/* Error illustration */}
      <View style={styles.errorIllustration}>
        <View style={styles.chessboardPattern}>
          <View style={styles.patternRow}>
            <View style={[styles.patternSquare, styles.dark]} />
            <View style={[styles.patternSquare, styles.light]} />
            <View style={[styles.patternSquare, styles.dark]} />
            <View style={[styles.patternSquare, styles.light]} />
          </View>
          <View style={styles.patternRow}>
            <View style={[styles.patternSquare, styles.light]} />
            <View style={[styles.patternSquare, styles.dark]} />
            <View style={[styles.patternSquare, styles.light]} />
            <View style={[styles.patternSquare, styles.dark]} />
          </View>
        </View>
        <Text style={styles.errorText}>404</Text>
        <Text style={styles.errorSubtext}>Checkmate! Page not found.</Text>
      </View>
      
      {/* Error message */}
      <View style={styles.messageContainer}>
        <Text style={styles.title}>Oops! Stalemate?</Text>
        <Text style={styles.message}>
            The page you're looking for made an illegal move{'\n'}
            and doesn't exist anymore.
        </Text>
      </View>
      
      {/* Suggestions */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Suggested moves:</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => {
              if (suggestion.route === '/') {
                router.push('/');
              } else {
                router.push(suggestion.route as any);
              }
            }}
          >
            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            <Text style={styles.suggestionText}>{suggestion.title}</Text>
            <Text style={styles.suggestionArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Go Back</Text>
      </TouchableOpacity>
      
      {/* Footer */}
      <Text style={styles.footer}>
        Chess Master • Version 1.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerEmoji: {
    fontSize: 16,
    letterSpacing: 4,
    color: '#4CAF50',
  },
  errorIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    position: 'relative',
  },
  chessboardPattern: {
    width: 120,
    height: 120,
    opacity: 0.1,
    position: 'absolute',
  },
  patternRow: {
    flexDirection: 'row',
  },
  patternSquare: {
    width: 30,
    height: 30,
  },
  dark: {
    backgroundColor: '#000',
  },
  light: {
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    zIndex: 1,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    zIndex: 1,
  },
  messageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  suggestionsContainer: {
    marginVertical: 20,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 12,
  },
  suggestionIcon: {
    fontSize: 20,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  suggestionArrow: {
    fontSize: 16,
    color: '#4CAF50',
  },
  backButton: {
    alignSelf: 'center',
    padding: 12,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 40,
    marginBottom: 20,
  },
});