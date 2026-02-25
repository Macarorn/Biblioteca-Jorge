import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  File? _profileImage;
  final ImagePicker _picker = ImagePicker();
  bool _loading = true;

  // Buscador eliminado — mostramos siempre los campos

  // Controladores
  late TextEditingController _nombreController;
  late TextEditingController _apellidoController;
  late TextEditingController _correoController;
  late TextEditingController _documentoController;
  late TextEditingController _tipoUsuarioController;
  // no usamos fecha de nacimiento
  late TextEditingController _celularController;

  @override
  void initState() {
    super.initState();

    _nombreController = TextEditingController();
    _apellidoController = TextEditingController();
    _correoController = TextEditingController();
    _documentoController = TextEditingController();
    _tipoUsuarioController = TextEditingController();
    _celularController = TextEditingController();

    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() => _loading = true);
    try {
      final perfil = await ApiService.getMiPerfil();
      if (!mounted) return;
      setState(() {
        _nombreController.text = (perfil['nombre'] ?? '').toString();
        _apellidoController.text = (perfil['apellido'] ?? '').toString();
        _correoController.text = (perfil['correo'] ?? '').toString();
        _documentoController.text = (perfil['documento'] ?? '').toString();
        _tipoUsuarioController.text = (perfil['rol'] ?? '').toString();
        _celularController.text = (perfil['telefono'] ?? '').toString();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error cargando perfil: $e')));
    }
  }

  Future<void> _pickImage() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );
    if (picked != null) {
      setState(() => _profileImage = File(picked.path));
    }
  }

  // Siempre mostramos los campos (sin buscador)
  bool _matchesSearch(String text) => true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Perfil"), centerTitle: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 30),

            GestureDetector(
              onTap: _isEditing ? _pickImage : null,
              child: CircleAvatar(
                radius: 70,
                backgroundColor: Colors.grey.shade400,
                backgroundImage: _profileImage != null
                    ? FileImage(_profileImage!)
                    : null,
                child: _profileImage == null
                    ? const Icon(Icons.person, size: 48, color: Colors.white)
                    : (_isEditing
                          ? const Icon(
                              Icons.camera_alt,
                              size: 28,
                              color: Colors.white70,
                            )
                          : null),
              ),
            ),

            const SizedBox(height: 16),

            // Nombre y Apellido
            if (_matchesSearch(
                  "${_nombreController.text} ${_apellidoController.text}",
                ) ||
                _matchesSearch(_tipoUsuarioController.text))
              _isEditing
                  ? Column(
                      children: [
                        _editableField(
                          Icons.person,
                          "Nombre",
                          _nombreController,
                        ),
                        const SizedBox(height: 10),
                        _editableField(
                          Icons.person_outline,
                          "Apellido",
                          _apellidoController,
                        ),
                      ],
                    )
                  : Text(
                      "${_nombreController.text} ${_apellidoController.text}",
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

            const SizedBox(height: 40),

            if (_loading)
              const Center(child: CircularProgressIndicator())
            else ...[
              // Correo
              if (_matchesSearch(_correoController.text))
                _isEditing
                    ? _editableField(Icons.email, "Correo", _correoController)
                    : _infoRow(Icons.email, "Correo", _correoController.text),

              // Documento (no editable)
              if (_matchesSearch(_documentoController.text))
                _infoRow(Icons.badge, "Documento", _documentoController.text),

              // Celular
              if (_matchesSearch(_celularController.text))
                _isEditing
                    ? _editableField(Icons.phone, "Celular", _celularController)
                    : _infoRow(Icons.phone, "Celular", _celularController.text),

              // Tipo usuario (no editable)
              if (_matchesSearch(_tipoUsuarioController.text))
                _infoRow(
                  Icons.school,
                  "Tipo de usuario",
                  _tipoUsuarioController.text,
                ),

              // Fecha de nacimiento eliminada (no disponible)
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    if (_isEditing) {
                      // Guardar
                      try {
                        await ApiService.updateMiPerfil(
                          nombre: _nombreController.text.trim(),
                          apellido: _apellidoController.text.trim(),
                          correo: _correoController.text.trim(),
                          telefono: _celularController.text.trim(),
                        );
                        if (!mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Perfil actualizado')),
                        );
                        setState(() => _isEditing = false);
                        await _loadProfile();
                      } catch (e) {
                        if (!mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Error guardando perfil: $e')),
                        );
                      }
                    } else {
                      setState(() => _isEditing = true);
                    }
                  },
                  icon: Icon(_isEditing ? Icons.save : Icons.edit),
                  label: Text(_isEditing ? "Guardar cambios" : "Editar perfil"),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Icon(icon, size: 28),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: Colors.grey)),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _editableField(
    IconData icon,
    String label,
    TextEditingController controller,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          prefixIcon: Icon(icon),
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _apellidoController.dispose();
    _correoController.dispose();
    _documentoController.dispose();
    _tipoUsuarioController.dispose();
    _celularController.dispose();
    super.dispose();
  }
}
