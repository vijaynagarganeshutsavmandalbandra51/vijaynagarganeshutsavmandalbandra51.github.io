using Microsoft.AspNetCore.Mvc;

namespace MandalWebsite.Server.Controllers;

/// <summary>
/// Serves the website content. There is no database – the content lives in JSON files
/// (client/public/data/*.json; years.json is generated from the media/years folders), which are copied to wwwroot/data when Angular is built.
/// Edit those JSON files to change what the website shows.
/// </summary>
[ApiController]
[Route("api/content")]
public class ContentController(IWebHostEnvironment env, ILogger<ContentController> logger) : ControllerBase
{
    // Only these files can be requested (prevents reading arbitrary files from disk).
    private static readonly HashSet<string> AllowedFiles = new(StringComparer.OrdinalIgnoreCase)
    {
        "mandal",       // name, dates, slider, marquee, history, awards, contact, UPI
        "schedule",     // day-wise programs
        "committee",    // office bearers
        "videos",       // YouTube videos (home + Live Darshan page)
        "initiatives",  // social & educational initiatives
        "years"         // generated from client/public/media/years/<year>/ folders at build time
    };

    /// <summary>List the available content files.</summary>
    [HttpGet]
    public IActionResult List() => Ok(AllowedFiles.Order());

    /// <summary>GET /api/content/mandal  -> wwwroot/data/mandal.json</summary>
    [HttpGet("{name}")]
    [ResponseCache(Duration = 60)]
    public IActionResult Get(string name)
    {
        if (!AllowedFiles.Contains(name))
        {
            return NotFound(new { message = $"Unknown content '{name}'." });
        }

        var path = Path.Combine(env.WebRootPath ?? "wwwroot", "data", $"{name.ToLowerInvariant()}.json");
        if (!System.IO.File.Exists(path))
        {
            logger.LogWarning("Content file not found: {Path}. Did you run 'npm run build:server'?", path);
            return NotFound(new { message = $"Content file '{name}.json' was not found." });
        }

        return PhysicalFile(path, "application/json; charset=utf-8");
    }
}
