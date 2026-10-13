// ------------------------------------------------------------------
//  Ganeshotsav Mandal website – ASP.NET Core host
//
//  * Serves the Angular app from wwwroot (built with `npm run build:server`).
//  * Serves the website content (JSON files, no database) at /api/content/{name}.
//  * Any unknown URL (e.g. /schedule) falls back to index.html so Angular routing works.
// ------------------------------------------------------------------

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error");
}

// Make sure phone-related files get the right content type.
var contentTypes = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
contentTypes.Mappings[".webmanifest"] = "application/manifest+json";
contentTypes.Mappings[".webp"] = "image/webp";
contentTypes.Mappings[".avif"] = "image/avif";

app.UseDefaultFiles();   // "/" -> index.html
app.UseStaticFiles(new StaticFileOptions { ContentTypeProvider = contentTypes }); // js, css, images, media, data/*.json

app.MapControllers();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTimeOffset.Now }));
app.MapGet("/error", () => Results.Problem("Something went wrong."));

// Angular client-side routes (/about, /schedule, ...) -> index.html
app.MapFallbackToFile("index.html");

app.Run();
