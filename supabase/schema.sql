-- ============================================================
--  El Café de Pirque — Esquema de base de datos (Supabase)
--  Copia y pega TODO este archivo en el SQL Editor de Supabase
--  y ejecútalo una sola vez.
-- ============================================================

-- ----------------------------------------------------------------
-- Limpieza (opcional, útil si quieres re-ejecutar desde cero)
-- ----------------------------------------------------------------
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ----------------------------------------------------------------
-- Tabla de categorías
-- ----------------------------------------------------------------
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Tabla de productos
-- ----------------------------------------------------------------
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para acelerar la consulta del menú por categoría
CREATE INDEX idx_products_category ON products(category_id);

-- ----------------------------------------------------------------
-- Políticas RLS (Row Level Security)
-- ----------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Lectura pública (para el menú que ven los clientes)
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (true);

-- Solo usuarios autenticados pueden escribir (panel admin)
CREATE POLICY "Auth users manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
--  SEED — Categorías
-- ============================================================
INSERT INTO categories (name, emoji, sort_order) VALUES
('Cafés y Bebidas Calientes', '☕', 1),
('Bebidas Frías', '🧃', 2),
('Desayunos y Onces', '🥐', 3),
('Sándwiches', '🥪', 4),
('Tortas y Pasteles', '🍰', 5),
('Platos del Día', '🥘', 6),
('Helados Artesanales', '🍦', 7),
('Empanadas', '🥟', 8);

-- ============================================================
--  SEED — Productos (4 por categoría, precios en CLP)
--  Se usa una columna auxiliar "cat" para enlazar por nombre.
-- ============================================================
INSERT INTO products (category_id, name, description, price, image_url, available, sort_order)
SELECT c.id, p.name, p.description, p.price, p.image_url, p.available, p.sort_order
FROM (
  VALUES
  -- ☕ Cafés y Bebidas Calientes
  ('Cafés y Bebidas Calientes', 'Espresso', 'Café espresso intenso de grano seleccionado, cuerpo aterciopelado y aroma profundo.', 2200, 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Cafés y Bebidas Calientes', 'Cappuccino', 'Espresso con leche vaporizada y una corona de espuma cremosa, espolvoreado con cacao.', 3200, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Cafés y Bebidas Calientes', 'Latte Vainilla', 'Suave café latte con un toque de vainilla natural y leche espumada.', 3600, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Cafés y Bebidas Calientes', 'Chocolate Caliente', 'Chocolate artesanal cremoso coronado con crema batida y un toque de canela.', 3400, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80', TRUE, 4),

  -- 🧃 Bebidas Frías
  ('Bebidas Frías', 'Limonada Menta-Jengibre', 'Refrescante limonada natural con hojas de menta fresca y un toque de jengibre.', 3200, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Bebidas Frías', 'Café Helado', 'Espresso doble sobre hielo con leche fría, dulzor justo y mucha frescura.', 3500, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Bebidas Frías', 'Jugo Natural de Frutilla', 'Jugo recién exprimido de frutillas de Pirque, sin azúcar añadida.', 2900, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Bebidas Frías', 'Smoothie Tropical', 'Mango, plátano y maracuyá batidos con yogur natural y hielo.', 4200, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80', TRUE, 4),

  -- 🥐 Desayunos y Onces
  ('Desayunos y Onces', 'Desayuno Campestre', 'Café o té, jugo natural, huevos revueltos, pan amasado y mermelada casera.', 6900, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Desayunos y Onces', 'Croissant con Mantequilla', 'Croissant de masa hojaldrada recién horneado, dorado y crujiente.', 2600, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Desayunos y Onces', 'Pan Amasado con Palta', 'Pan amasado tibio con palta fresca, sal de mar y un hilo de aceite de oliva.', 3800, 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Desayunos y Onces', 'Yogur con Granola y Miel', 'Yogur natural con granola artesanal, frutos rojos y miel de la zona.', 4100, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80', TRUE, 4),

  -- 🥪 Sándwiches
  ('Sándwiches', 'Sándwich Italiano', 'Lomo, palta, tomate y mayonesa en pan amasado, un clásico chileno generoso.', 5900, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Sándwiches', 'Barros Luco', 'Carne mechada y queso derretido en pan caliente, jugoso y reconfortante.', 6200, 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Sándwiches', 'Vegetariano de la Casa', 'Champiñones salteados, palta, tomate, rúcula y queso de cabra en pan ciabatta.', 5600, 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Sándwiches', 'Churrasco Palta', 'Filete de res a la plancha con palta cremosa y tomate fresco en pan frica.', 6400, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80', TRUE, 4),

  -- 🍰 Tortas y Pasteles
  ('Tortas y Pasteles', 'Torta de Mil Hojas', 'Capas de hojarasca crujiente con manjar casero, un imperdible chileno.', 4500, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Tortas y Pasteles', 'Cheesecake de Frambuesa', 'Cremoso cheesecake con salsa de frambuesas frescas y base de galleta.', 4300, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Tortas y Pasteles', 'Brownie con Helado', 'Brownie tibio de chocolate intenso con una bola de helado de vainilla.', 4800, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Tortas y Pasteles', 'Kuchen de Manzana', 'Kuchen casero de manzana con canela, receta tradicional del sur.', 3900, 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80', TRUE, 4),

  -- 🥘 Platos del Día
  ('Platos del Día', 'Cazuela de Vacuno', 'Cazuela casera con carne, zapallo, choclo y papas, caldo lleno de sabor.', 7900, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Platos del Día', 'Pastel de Choclo', 'Pino de carne, pollo y huevo cubierto con crema de choclo gratinada.', 8200, 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Platos del Día', 'Ensalada de Quínoa', 'Quínoa, palta, tomate cherry, garbanzos y vinagreta de limón.', 6500, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Platos del Día', 'Salmón a la Plancha', 'Filete de salmón con puré rústico y vegetales salteados de la huerta.', 9800, 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80', TRUE, 4),

  -- 🍦 Helados Artesanales
  ('Helados Artesanales', 'Helado de Lúcuma', 'Cremoso helado artesanal de lúcuma, el sabor más querido de Chile.', 2800, 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Helados Artesanales', 'Helado de Chirimoya', 'Helado suave de chirimoya fresca, dulce y delicado.', 2800, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Helados Artesanales', 'Copa Frutilla y Crema', 'Helado de frutilla con crema batida y frutillas frescas de Pirque.', 3900, 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Helados Artesanales', 'Helado de Chocolate Belga', 'Intenso helado de chocolate belga con trozos de cacao.', 3200, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', TRUE, 4),

  -- 🥟 Empanadas
  ('Empanadas', 'Empanada de Pino', 'Empanada de horno con pino de carne, cebolla, huevo, aceituna y pasas.', 2900, 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&w=800&q=80', TRUE, 1),
  ('Empanadas', 'Empanada de Queso', 'Empanada frita rellena de queso fundido, crujiente y dorada.', 2400, 'https://images.unsplash.com/photo-1625938145312-c98f37460700?auto=format&fit=crop&w=800&q=80', TRUE, 2),
  ('Empanadas', 'Empanada Napolitana', 'Jamón, queso, tomate y orégano en masa de horno recién horneada.', 3100, 'https://images.unsplash.com/photo-1604467794349-0b74285de7e7?auto=format&fit=crop&w=800&q=80', TRUE, 3),
  ('Empanadas', 'Empanada de Champiñón', 'Champiñones salteados con queso y hierbas, opción vegetariana.', 3000, 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&w=800&q=80', TRUE, 4)
) AS p(cat, name, description, price, image_url, available, sort_order)
JOIN categories c ON c.name = p.cat;
