terraform {
  required_providers {
    openstack = {
      source  = "terraform-provider-openstack/openstack"
      version = "~> 1.54"
    }
  }
}

provider "openstack" {
  user_name   = "PCU-6KYMHK9"
  password    = "Projet-GAMRI-5"  # Jamais en clair !
  tenant_name = "PCP-6KYMHK9"
  auth_url    = "https://api.pub1.infomaniak.cloud/identity/v3"
  region      = "dc3-a"         # Genève 🇨🇭
}
