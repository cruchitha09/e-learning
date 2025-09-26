import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Staxtech E-Learn',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String baseUrl = const String.fromEnvironment('API_BASE', defaultValue: 'http://localhost:4000');
  String? token;
  String? message;
  List<dynamic> courses = [];

  Future<void> signup() async {
    final res = await http.post(Uri.parse('$baseUrl/api/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'name': 'Mobile User', 'email': 'mobile@example.com', 'password': 'password123'}));
    if (res.statusCode == 201) {
      final body = jsonDecode(res.body);
      setState(() => token = body['token']);
    } else {
      setState(() => message = res.body);
    }
  }

  Future<void> fetchCourses() async {
    final res = await http.get(Uri.parse('$baseUrl/api/courses'));
    if (res.statusCode == 200) {
      setState(() => courses = jsonDecode(res.body));
    } else {
      setState(() => message = res.body);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Staxtech E-Learn')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              ElevatedButton(onPressed: signup, child: const Text('Quick Sign Up')),
              const SizedBox(width: 12),
              ElevatedButton(onPressed: fetchCourses, child: const Text('Load Courses')),
            ]),
            const SizedBox(height: 16),
            if (token != null) Text('JWT: ${token!.substring(0, 16)}...'),
            if (message != null) Text(message!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 16),
            const Text('Courses', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                itemCount: courses.length,
                itemBuilder: (context, i) {
                  final c = courses[i];
                  return ListTile(
                    title: Text(c['title'] ?? ''),
                    subtitle: Text('Level: ${c['level']}'),
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}


