import 'package:flutter/material.dart';

import '../services/api_service.dart';

class BookDetailScreen extends StatefulWidget {
  final Map<String, dynamic> libro;
  const BookDetailScreen({super.key, required this.libro});

  @override
  State<BookDetailScreen> createState() => _BookDetailScreenState();
}

class _BookDetailScreenState extends State<BookDetailScreen> {
  bool _loading = true;
  Map<String, dynamic> _detalle = {};
  bool _solicitando = false;

  @override
  void initState() {
    super.initState();
    _loadDetalle();
  }

  Future<void> _loadDetalle() async {
    setState(() => _loading = true);
    try {
      final rawId =
          widget.libro['id'] ??
          widget.libro['id_libro'] ??
          widget.libro['idLibro'];
      final id = rawId is int ? rawId : int.tryParse(rawId.toString()) ?? 0;
      if (id == 0) throw Exception('ID inválido');

      final detalle = await ApiService.getLibroDetalle(id);
      if (!mounted) return;
      setState(() {
        _detalle = detalle;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error cargando detalle: $e')));
    }
  }

  Future<void> _solicitar() async {
    final rawId =
        _detalle['id'] ?? _detalle['id_libro'] ?? widget.libro['id'] ?? 0;
    final id = rawId is int ? rawId : int.tryParse(rawId.toString()) ?? 0;
    if (id == 0) return;

    setState(() => _solicitando = true);
    try {
      final idSolicitud = await ApiService.solicitarLibro(id);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Solicitud creada (#$idSolicitud)')),
      );
      // Reload detalle to update disponibles
      await _loadDetalle();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error solicitando libro: $e')));
    } finally {
      if (!mounted) return;
      setState(() => _solicitando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final titulo =
        (_detalle['titulo'] ?? widget.libro['titulo'] ?? 'Sin título')
            .toString();
    final autor = (_detalle['autor'] ?? widget.libro['autor'] ?? 'Sin autor')
        .toString();
    final genero =
        (_detalle['genero'] ??
                _detalle['area'] ??
                widget.libro['genero'] ??
                'General')
            .toString();
    final anio =
        (_detalle['anio'] ??
                _detalle['anio_publicacion'] ??
                widget.libro['anio'] ??
                '')
            .toString();
    final portada =
        (_detalle['portadaUrl'] ??
                _detalle['portada_url'] ??
                widget.libro['portadaUrl'] ??
                '')
            .toString();
    final disponibles =
        int.tryParse(
          (_detalle['ejemplares_disponibles'] ??
                  _detalle['ejemplaresDisponibles'] ??
                  0)
              .toString(),
        ) ??
        0;

    return Scaffold(
      appBar: AppBar(title: Text(titulo)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (portada.trim().isNotEmpty)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        portada,
                        width: double.infinity,
                        height: 260,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          height: 260,
                          color: Colors.black12,
                          alignment: Alignment.center,
                          child: const Icon(Icons.broken_image, size: 48),
                        ),
                      ),
                    )
                  else
                    Container(
                      height: 260,
                      width: double.infinity,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        color: Colors.black12,
                      ),
                      child: const Icon(Icons.menu_book, size: 64),
                    ),
                  const SizedBox(height: 12),
                  Text(
                    titulo,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('Autor: $autor'),
                  const SizedBox(height: 4),
                  Text('Género: $genero'),
                  const SizedBox(height: 4),
                  Text('Año: ${anio.isEmpty ? '—' : anio}'),
                  const SizedBox(height: 12),
                  if ((_detalle['descripcion'] ??
                          _detalle['sinopsis'] ??
                          widget.libro['descripcion']) !=
                      null)
                    Text(
                      (_detalle['descripcion'] ??
                              _detalle['sinopsis'] ??
                              widget.libro['descripcion'])
                          .toString(),
                    ),

                  const SizedBox(height: 18),
                  Row(
                    children: [
                      Text('Ejemplares disponibles: $disponibles'),
                      const SizedBox(width: 12),
                      if (disponibles > 0)
                        ElevatedButton(
                          onPressed: _solicitando ? null : _solicitar,
                          child: _solicitando
                              ? const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Text('Solicitar'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }
}
