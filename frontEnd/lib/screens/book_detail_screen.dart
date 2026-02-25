import 'package:flutter/material.dart';

class BookDetailScreen extends StatelessWidget {
  final Map<String, dynamic> libro;
  const BookDetailScreen({super.key, required this.libro});

  @override
  Widget build(BuildContext context) {
    final titulo = (libro['titulo'] ?? 'Sin título').toString();
    final autor = (libro['autor'] ?? 'Sin autor').toString();
    final genero = (libro['genero'] ?? libro['area'] ?? 'General').toString();
    final anio = (libro['anio'] ?? libro['anio_publicacion'] ?? '').toString();
    final portada = (libro['portadaUrl'] ?? libro['portada_url'] ?? '')
        .toString();

    return Scaffold(
      appBar: AppBar(title: Text(titulo)),
      body: SingleChildScrollView(
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
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            Text('Autor: $autor'),
            const SizedBox(height: 4),
            Text('Género: $genero'),
            const SizedBox(height: 4),
            Text('Año: ${anio.isEmpty ? '—' : anio}'),
            const SizedBox(height: 12),
            // descripción opcional si existe
            if ((libro['descripcion'] ?? libro['sinopsis']) != null)
              Text((libro['descripcion'] ?? libro['sinopsis']).toString()),
          ],
        ),
      ),
    );
  }
}
