import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  File? _profileImage;
  final ImagePicker _picker = ImagePicker();

  final TextEditingController _searchController = TextEditingController();
  String _searchText = "";

  // Controladores
  late TextEditingController _nombreController;
  late TextEditingController _apellidoController;
  late TextEditingController _correoController;
  late TextEditingController _documentoController;
  late TextEditingController _tipoUsuarioController;
  late TextEditingController _fechaNacimientoController;
  late TextEditingController _celularController;

  @override
  void initState() {
    super.initState();

    _nombreController = TextEditingController(text: "Pacho");
    _apellidoController = TextEditingController(text: "Rodrigez");
    _correoController =
        TextEditingController(text: "pachitord10@email.com");
    _documentoController =
        TextEditingController(text: "CC 123456642");
    _tipoUsuarioController =
        TextEditingController(text: "Estudiante");
    _fechaNacimientoController =
        TextEditingController(text: "1999-05-20");
    _celularController =
        TextEditingController(text: "3001234567");
  }

  Future<void> _pickImage() async {
    final picked =
        await _picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked != null) {
      setState(() => _profileImage = File(picked.path));
    }
  }

  bool _matchesSearch(String text) {
    if (_searchText.isEmpty) return true;
    return text.toLowerCase().contains(_searchText.toLowerCase());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Perfil"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              controller: _searchController,
              onChanged: (value) {
                setState(() => _searchText = value);
              },
              decoration: InputDecoration(
                hintText: "Buscar información...",
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.grey.shade200,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                  borderSide: BorderSide.none,
                ),
              ),
            ),

            const SizedBox(height: 30),

            GestureDetector(
              onTap: _isEditing ? _pickImage : null,
              child: CircleAvatar(
                radius: 70,
                backgroundImage: _profileImage != null
                    ? FileImage(_profileImage!)
                    : const AssetImage(
                        "assets/images/profile_default.jpg")
                        as ImageProvider,
                child: _isEditing
                    ? const Icon(Icons.camera_alt,
                        size: 40, color: Colors.white70)
                    : null,
              ),
            ),

            const SizedBox(height: 16),

            // Nombre y Apellido
            if (_matchesSearch(
                "${_nombreController.text} ${_apellidoController.text}") ||
                _matchesSearch(_tipoUsuarioController.text))
              _isEditing
                  ? Column(
                      children: [
                        _editableField(
                            Icons.person, "Nombre", _nombreController),
                        const SizedBox(height: 10),
                        _editableField(Icons.person_outline,
                            "Apellido", _apellidoController),
                      ],
                    )
                  : Text(
                      "${_nombreController.text} ${_apellidoController.text}",
                      style: const TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold),
                    ),

            const SizedBox(height: 40),

            // Correo
            if (_matchesSearch(_correoController.text))
              _isEditing
                  ? _editableField(
                      Icons.email, "Correo", _correoController)
                  : _infoRow(Icons.email, "Correo",
                      _correoController.text),

            // Documento
            if (_matchesSearch(_documentoController.text))
              _isEditing
                  ? _editableField(
                      Icons.badge, "Documento",
                      _documentoController)
                  : _infoRow(Icons.badge, "Documento",
                      _documentoController.text),

            // Celular
            if (_matchesSearch(_celularController.text))
              _isEditing
                  ? _editableField(
                      Icons.phone, "Celular",
                      _celularController)
                  : _infoRow(Icons.phone, "Celular",
                      _celularController.text),

            // Tipo usuario
            if (_matchesSearch(_tipoUsuarioController.text))
              _isEditing
                  ? _editableField(Icons.school,
                      "Tipo de usuario",
                      _tipoUsuarioController)
                  : _infoRow(Icons.school,
                      "Tipo de usuario",
                      _tipoUsuarioController.text),

            // Fecha nacimiento
            if (_matchesSearch(
                _fechaNacimientoController.text))
              _isEditing
                  ? _editableField(Icons.cake,
                      "Nacimiento",
                      _fechaNacimientoController)
                  : _infoRow(Icons.cake, "Nacimiento",
                      _fechaNacimientoController.text),

            const SizedBox(height: 40),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    _isEditing = !_isEditing;
                  });
                },
                icon: Icon(
                    _isEditing ? Icons.save : Icons.edit),
                label: Text(_isEditing
                    ? "Guardar cambios"
                    : "Editar perfil"),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(
      IconData icon, String label, String value) {
    return Padding(
      padding:
          const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Icon(icon, size: 28),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: const TextStyle(
                      color: Colors.grey)),
              Text(value,
                  style: const TextStyle(
                      fontSize: 18,
                      fontWeight:
                          FontWeight.w600)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _editableField(
      IconData icon,
      String label,
      TextEditingController controller) {
    return Padding(
      padding:
          const EdgeInsets.symmetric(vertical: 10),
      child: TextField(
        controller: controller,
        decoration: InputDecoration(
          prefixIcon: Icon(icon),
          labelText: label,
          border: OutlineInputBorder(
            borderRadius:
                BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nombreController.dispose();
    _apellidoController.dispose();
    _correoController.dispose();
    _documentoController.dispose();
    _tipoUsuarioController.dispose();
    _fechaNacimientoController.dispose();
    _celularController.dispose();
    super.dispose();
  }
}
