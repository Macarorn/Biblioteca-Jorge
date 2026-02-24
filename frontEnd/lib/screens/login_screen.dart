import 'package:flutter/material.dart';
import 'main_navigation.dart';
import 'user_home.dart';
import '../services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usuarioController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _usuarioController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final doc = _usuarioController.text.trim();
    final pass = _passwordController.text.trim();
    if (doc.isEmpty || pass.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Documento y contraseña son requeridos")),
      );
      return;
    }

    try {
      await ApiService.login(documento: doc, contrasena: pass);

      if (!mounted) return;
      // Leer el rol actualizado desde SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final rol = prefs.getString('rol');
      final rolNormalizado = rol?.trim().toLowerCase();
      print('ROL RECIBIDO (prefs): $rolNormalizado');
      if (rolNormalizado == 'admin' || rolNormalizado == 'bibliotecario') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const MainNavigation()),
        );
      } else if (rolNormalizado == 'estudiante' || rolNormalizado == 'profesor') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomePage()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Rol no reconocido: $rolNormalizado. Contacte al administrador.")),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("❌ Login falló: $e")),
      );
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: Padding(
            padding: const EdgeInsets.all(30),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.local_library,
                  size: 90,
                  color: Color(0xFFC8A33A),
                ),
                const SizedBox(height: 20),
                const Text(
                  "BIBLIOTECA IECR",
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0B2A4A),
                  ),
                ),
                const SizedBox(height: 40),

                TextField(
                  controller: _usuarioController,
                  decoration: const InputDecoration(
                    labelText: "Usuario",
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 20),

                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: "Contraseña",
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 30),

                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFC8A33A),
                      foregroundColor: Colors.black,
                    ),
                    onPressed: _login,
                    child: const Text(
                      "INICIAR SESIÓN",
                      style: TextStyle(fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
