import { useState } from "react";
import { Box, Container, Typography, IconButton, Dialog, DialogContent } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";

export function BrandVideo() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ py: 8, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              mb: 1.5,
              bgcolor: "rgba(0, 0, 0, 0.05)",
              px: 2,
              py: 0.6,
              borderRadius: 9999,
            }}
          >
            <VerifiedIcon sx={{ color: "#000000", fontSize: 16 }} />
            <Typography
              variant="caption"
              sx={{ color: "#111827", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}
            >
              CRAFTED FOR PERFORMANCE
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#000000",
              fontSize: { xs: "2rem", md: "2.8rem" },
              letterSpacing: "-0.03em",
              mt: 0.5,
            }}
          >
            Inside KIXORA Crafting Lab
          </Typography>

          <Typography variant="body1" sx={{ color: "#6b7280", maxWidth: 620, mx: "auto", mt: 1 }}>
            Step inside our cutting-edge design studio where carbon aerodynamics, aerospace materials, and street luxury converge.
          </Typography>
        </Box>

        {/* Cinematic Video Showcase Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 280, sm: 420, md: 540 },
            borderRadius: { xs: 4, md: 6 },
            overflow: "hidden",
            bgcolor: "#000000",
            border: "1px solid #1f2937",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
            "&:hover .play-btn": {
              transform: "scale(1.15)",
              bgcolor: "#ffffff",
              color: "#000000",
            },
            "&:hover .video-bg": {
              transform: "scale(1.04)",
            },
          }}
          onClick={() => setOpen(true)}
        >
          {/* Background Cinematic Poster Image */}
          <Box
            className="video-bg"
            component="img"
            src="/img/kixora/brand_video.jpg"
            alt="KIXORA Crafting Lab Film"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.6s ease",
            }}
          />

          {/* Dark Cinematic Vignette Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Center Play Button Pulse */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              zIndex: 2,
            }}
          >
            <Box
              className="play-btn"
              sx={{
                width: { xs: 68, md: 88 },
                height: { xs: 68, md: 88 },
                borderRadius: "50%",
                bgcolor: "rgba(255, 255, 255, 0.95)",
                color: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 35px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <PlayArrowIcon sx={{ fontSize: { xs: 36, md: 46 }, ml: 0.5 }} />
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                color: "#ffffff",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                fontSize: { xs: "0.85rem", md: "1rem" },
              }}
            >
              Watch Brand Story (4K)
            </Typography>
          </Box>

          {/* Bottom Video Details Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 20, md: 35 },
              left: { xs: 20, md: 40 },
              right: { xs: 20, md: 40 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              zIndex: 2,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 700, letterSpacing: "0.15em" }}>
                OFFICIAL KIXORA CINEMATIC
              </Typography>
              <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 900, mt: 0.3 }}>
                The Genesis of Motion &bull; Season 2026
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="caption" sx={{ color: "#ffffff", bgcolor: "rgba(255,255,255,0.2)", px: 1.5, py: 0.6, borderRadius: 2, fontWeight: 800 }}>
                4K UHD &bull; 02:45 MIN
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Video Player Modal */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                bgcolor: "#000000",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #1f2937",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "#ffffff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
              }}
            >
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="KIXORA Brand Story Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
