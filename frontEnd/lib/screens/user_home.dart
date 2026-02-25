import 'dart:async';

import 'package:flutter/material.dart';

import '../services/api_service.dart';
import 'book_detail_screen.dart';
import 'mis_solicitudes_screen.dart';
import 'perfil_usuario.dart';
import 'login_screen.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final Color azul = const Color(0xFF0A2342);
  final Color dorado = const Color(0xFFD4A537);

  bool loading = true;
  List<Map<String, dynamic>> libros = [];
  Timer? _debounce;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load({String q = ''}) async {
    setState(() => loading = true);
    try {
      final data = await ApiService.getLibros(search: q);
      if (!mounted) return;
      setState(() {
        libros = data;
        loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90),
        child: Stack(
          children: [
            Container(
              color: azul,
              padding: const EdgeInsets.only(top: 40, left: 16, right: 16),
              child: Column(
                children: [
                  const Text(
                    'BIBLIOTECA IER',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(height: 2, color: Color(0xFFD4A537)),
                ],
              ),
            ),
            Positioned(
              top: 0,
              right: 0,
              child: Padding(
                padding: const EdgeInsets.only(top: 30, right: 20),
                child: ElevatedButton.icon(
                  icon: Icon(Icons.logout),
                  label: Text('Salir'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: dorado,
                    foregroundColor: Colors.black,
                  ),
                  onPressed: () {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(
                        builder: (context) => const LoginScreen(),
                      ),
                      (route) => false,
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Container(
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: TextField(
                      decoration: const InputDecoration(
                        hintText: 'Buscar',
                        prefixIcon: Icon(Icons.search),
                        border: InputBorder.none,
                      ),
                      onChanged: (v) {
                        _searchQuery = v;
                        _debounce?.cancel();
                        _debounce = Timer(
                          const Duration(milliseconds: 400),
                          () {
                            _load(q: _searchQuery.trim());
                          },
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Row(
                  children: [
                    IconButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const MisSolicitudesScreen(),
                          ),
                        );
                      },
                      icon: const Icon(Icons.history, color: Colors.white),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const ProfileScreen(),
                          ),
                        );
                      },
                      child: CircleAvatar(
                        radius: 22,
                        backgroundColor: dorado,
                        child: const Icon(Icons.person, color: Colors.black),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            sectionTitle('Recomendados'),
            loading
                ? const SizedBox(
                    height: 160,
                    child: Center(child: CircularProgressIndicator()),
                  )
                : _bookCarousel(libros.take(6).toList()),
            sectionTitle('Nuevos'),
            loading
                ? const SizedBox(
                    height: 160,
                    child: Center(child: CircularProgressIndicator()),
                  )
                : _bookCarousel(
                    (List<Map<String, dynamic>>.from(libros)..sort((a, b) {
                          final ai =
                              int.tryParse((a['id'] ?? '').toString()) ?? 0;
                          final bi =
                              int.tryParse((b['id'] ?? '').toString()) ?? 0;
                          return bi.compareTo(ai);
                        }))
                        .take(6)
                        .toList(),
                  ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        color: azul,
        height: 60,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const MisSolicitudesScreen(),
                  ),
                );
              },
              icon: const Icon(
                Icons.assignment_outlined,
                color: Color(0xFFD4A537),
              ),
              label: const Text(
                'Solicitudes',
                style: TextStyle(color: Color(0xFFD4A537)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget sectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, top: 16),
      child: Text(
        text,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
      ),
    );
  }

  Widget _bookCarousel(List<Map<String, dynamic>> items) {
    final PageController controller = PageController(viewportFraction: 0.35);
    if (items.isEmpty) {
      return const SizedBox(
        height: 160,
        child: Center(child: Text('No hay libros')),
      );
    }

    return SizedBox(
      height: 160,
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left, size: 32),
            onPressed: () => controller.previousPage(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
            ),
          ),
          Expanded(
            child: PageView.builder(
              controller: controller,
              itemCount: items.length,
              itemBuilder: (context, index) {
                final b = items[index];
                final portada = (b['portadaUrl'] ?? b['portada_url'] ?? '')
                    .toString();
                final titulo = (b['titulo'] ?? 'Sin título').toString();
                return GestureDetector(
                  onTap: () async {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => BookDetailScreen(libro: b),
                      ),
                    );
                  },
                  child: Column(
                    children: [
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 6),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            color: Colors.grey[200],
                          ),
                          child: portada.trim().isEmpty
                              ? const Icon(Icons.menu_book, size: 48)
                              : Image.network(portada, fit: BoxFit.cover),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        titulo,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right, size: 32),
            onPressed: () => controller.nextPage(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }
}
