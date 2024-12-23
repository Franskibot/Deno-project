import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import app from './api.ts'; // Assicurati di importare correttamente le rotte

// Avvia il server sulla porta 3000
serve(app.fetch, { port: 3000 });
console.log('Server running on http://localhost:3000');