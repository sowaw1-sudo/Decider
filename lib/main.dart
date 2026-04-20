import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  runApp(const DeciderApp());
}

class DeciderApp extends StatelessWidget {
  const DeciderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Decider',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0D0D1A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF7C5CBF),
          surface: Color(0xFF0D0D1A),
          onSurface: Colors.white,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
