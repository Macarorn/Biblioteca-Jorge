import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  final Color azul = const Color(0xFF0A2342);
  final Color dorado = const Color(0xFFD4A537);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      // HEADER
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90),
        child: Container(
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
              Container(height: 2, color: dorado),
            ],
          ),
        ),
      ),

      // BODY
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // BUSCADOR + PERFIL
            Row(
              children: [
                Expanded(
                  child: Container(
                    height: 40,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const TextField(
                      decoration: InputDecoration(
                        hintText: 'Buscar',
                        prefixIcon: Icon(Icons.search),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                CircleAvatar(
                  radius: 22,
                  backgroundColor: dorado,
                  child: const Icon(Icons.person, color: Colors.black),
                )
              ],
            ),

            const SizedBox(height: 20),

            // SECCIONES
            sectionTitle('Recomendados'),
            bookCarousel(),

            sectionTitle('Libros de miedo y suspenso'),
            bookCarousel(),

            sectionTitle('Libros de anime'),
            bookCarousel(),
          ],
        ),
      ),

      // BOTTOM BAR (solo visual)
      bottomNavigationBar: Container(
        height: 60,
        color: azul,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: const [
            Icon(Icons.home, color: Color(0xFFD4A537), size: 30),
            Icon(Icons.menu_book, color: Color(0xFFD4A537), size: 30),
          ],
        ),
      ),
    );
  }

  // TITULO DE SECCION
  Widget sectionTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, top: 16),
      child: Text(
        text,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    );
  }

  
  // CARRUSEL DE LIBROS
  
  Widget bookCarousel() {
    final PageController controller = PageController(viewportFraction: 0.35);
    const int totalLibros = 5;

    return SizedBox(
      height: 190,
      child: Row(
        children: [
          // FLECHA IZQUIERDA
          IconButton(
            icon: const Icon(Icons.chevron_left, size: 32),
            onPressed: () {
              controller.previousPage(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              );
            },
          ),

          // CARRUSEL
          Expanded(
            child: PageView.builder(
              controller: controller,
              itemBuilder: (context, index) {
                final libro = (index % totalLibros) + 1;

                return Column(
                  children: [
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 6),
                        decoration: BoxDecoration(
                          color: Colors.grey[300],
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Libro $libro',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 10),
                    )
                  ],
                );
              },
            ),
          ),

          // FLECHA DERECHA
          IconButton(
            icon: const Icon(Icons.chevron_right, size: 32),
            onPressed: () {
              controller.nextPage(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              );
            },
          ),
        ],
      ),
    );
  }
}
