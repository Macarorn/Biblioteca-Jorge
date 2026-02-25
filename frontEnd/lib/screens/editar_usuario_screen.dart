import 'package:flutter/material.dart';

import '../services/api_service.dart';

class EditarUsuarioScreen extends StatefulWidget {
  final Map<String, dynamic> usuario;
  const EditarUsuarioScreen({super.key, required this.usuario});

  @override
  State<EditarUsuarioScreen> createState() => _EditarUsuarioScreenState();
}

class _EditarUsuarioScreenState extends State<EditarUsuarioScreen> {
  late TextEditingController _nombreController;
  late TextEditingController _apellidoController;
  late TextEditingController _correoController;
  late TextEditingController _telefonoController;
  String _rol = 'estudiante';
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    final u = widget.usuario;
    _nombreController = TextEditingController(
      text: (u['nombre'] ?? '').toString(),
    );
    _apellidoController = TextEditingController(
      text: (u['apellido'] ?? '').toString(),
    );
    _correoController = TextEditingController(
      text: (u['correo'] ?? '').toString(),
    );
    _telefonoController = TextEditingController(
      text: (u['telefono'] ?? '').toString(),
    );
    _rol = (u['rol'] ?? 'estudiante').toString();
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _apellidoController.dispose();
    _correoController.dispose();
    _telefonoController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _loading = true);
    try {
      final idRaw =
          widget.usuario['id'] ??
          widget.usuario['id_usuario'] ??
          widget.usuario['idUsuario'];
      final id = idRaw is int ? idRaw : int.tryParse(idRaw.toString()) ?? 0;
      if (id == 0) throw Exception('ID inválido');

      await ApiService.adminUpdateUsuario(id, {
        'nombre': _nombreController.text.trim(),
        'apellido': _apellidoController.text.trim(),
        'correo': _correoController.text.trim(),
        'telefono': _telefonoController.text.trim(),
        'rol': _rol,
      });

      if (!mounted) return;
      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error guardando usuario: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Editar usuario')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _nombreController,
              decoration: const InputDecoration(labelText: 'Nombre'),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _apellidoController,
              decoration: const InputDecoration(labelText: 'Apellido'),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _correoController,
              decoration: const InputDecoration(labelText: 'Correo'),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _telefonoController,
              decoration: const InputDecoration(labelText: 'Teléfono'),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _rol,
              items: const [
                DropdownMenuItem(
                  value: 'estudiante',
                  child: Text('Estudiante'),
                ),
                DropdownMenuItem(value: 'profesor', child: Text('Profesor')),
                DropdownMenuItem(
                  value: 'bibliotecario',
                  child: Text('Bibliotecario'),
                ),
                DropdownMenuItem(value: 'admin', child: Text('Admin')),
              ],
              onChanged: (v) => setState(() => _rol = v ?? 'estudiante'),
              decoration: const InputDecoration(labelText: 'Rol'),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loading ? null : _save,
                child: _loading
                    ? const SizedBox(
                        height: 18,
                        width: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Guardar'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
