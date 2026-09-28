# Installation

There are several ways to get llama.cpp on your machine:

- Recommended: one-line install command
- Install with a package manager
- Download prebuilt binaries from the releases page
- Run with Docker
- Build from source

All of them give you the same set of tools (`llama cli`, `llama serve` and others).

## One-line install (recommended)

This is the easiest way to get started with llama.cpp. The following command detects your platform, fetches the latest version of the llama binary and installs it.

```bash
curl -LsSf https://llama.app/install.sh | sh
```

On Windows, run this in PowerShell instead:

```powershell
irm https://llama.app/install.ps1 | iex
```

## Package managers

```sh
brew install llama.cpp                   # macOS and Linux
winget install llama.cpp                 # Windows
nix profile install nixpkgs#llama-cpp    # macOS and Linux
conda install -c conda-forge llama.cpp   # Windows, macOS, and Linux
```

These are updated automatically with new releases. See [install.md](https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md) for MacPorts and more options.

## Prebuilt binaries

Every release ships binaries for each platform and backend (CUDA, Vulkan, Metal, and more) on the [releases page](https://github.com/ggml-org/llama.cpp/releases).

## Docker

```sh
docker run -p 8080:8080 -v ~/models:/models \
  ghcr.io/ggml-org/llama.cpp:server \
  -m /models/model.gguf --host 0.0.0.0
```

CUDA, ROCm, and other variants are listed in the [Docker docs](https://github.com/ggml-org/llama.cpp/blob/master/docs/docker.md).

## Build from source

```sh
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release
```

See the [build guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md) for enabling GPU backends.

Looking for a desktop app instead? [Llama](https://llama.app) runs llama.cpp for you, with nothing to set up.

## Verify the installation

```sh
llama cli --version
```

If this prints the version and build info, you are ready to go. Continue with the [Quickstart](quickstart) to download and run your first model.
