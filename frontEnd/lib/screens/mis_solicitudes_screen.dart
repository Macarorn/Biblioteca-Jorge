import 'package:flutter/material.dart';

import '../services/api_service.dart';

class MisSolicitudesScreen extends StatefulWidget {
  const MisSolicitudesScreen({super.key});

  @override
  State<MisSolicitudesScreen> createState() => _MisSolicitudesScreenState();
}

class _MisSolicitudesScreenState extends State<MisSolicitudesScreen> {
  bool loading = true;
  List<Map<String, dynamic>> solicitudes = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    try {
      final data = await ApiService.getMisSolicitudes();
      if (!mounted) return;
      setState(() {
        solicitudes = data;
        loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al cargar solicitudes: ${e.toString()}')),
      );
    }
  }

  Color _colorForEstado(String estado) {
    switch (estado) {
      case 'aprobada':
        return Colors.green;
      case 'rechazada':
        return Colors.red;
      case 'cancelada':
        return Colors.grey;
      default:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mis solicitudes')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : solicitudes.isEmpty
          ? const Center(child: Text('No has realizado solicitudes'))
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView.separated(
                padding: const EdgeInsets.all(12),
                itemCount: solicitudes.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final s = solicitudes[index];
                  final titulo = (s['titulo'] ?? 'Sin título').toString();
                  final fecha = (s['fecha_solicitud'] ?? '').toString();
                  final estado = (s['estado'] ?? '').toString();
                  final observ = (s['observacion'] ?? '').toString();

                  return Card(
                    child: ListTile(
                      title: Text(titulo),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text('Fecha: $fecha'),
                          if (observ.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Text('Observación: $observ'),
                          ],
                        ],
                      ),
                      trailing: Chip(
                        label: Text(estado),
                        backgroundColor: _colorForEstado(estado),
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
