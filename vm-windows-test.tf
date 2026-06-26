resource "openstack_compute_keypair_v2" "git_keypair" {
  name       = "git-lab-cloud-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPozB0lBd0n/QEc7kJPNVqufy4UahL4xsKFBNL0QOpz/ git-lab-cloud"
}

resource "openstack_networking_secgroup_v2" "win_sg" {
  name        = "git-windows-access"
  description = "Autorise RDP 3389 + ICMP"
}

resource "openstack_networking_secgroup_rule_v2" "rdp_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "tcp"
  port_range_min    = 3389
  port_range_max    = 3389
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.win_sg.id
}

resource "openstack_networking_secgroup_rule_v2" "icmp_rule" {
  direction         = "ingress"
  ethertype         = "IPv4"
  protocol          = "icmp"
  remote_ip_prefix  = "0.0.0.0/0"
  security_group_id = openstack_networking_secgroup_v2.win_sg.id
}

resource "openstack_compute_instance_v2" "vm_windows_test" {
  name            = "git-windows-test-01"
  flavor_name     = "a1-ram4-disk50-perf1"
  image_id        = "a3dd20e2-52e6-4f0c-915a-0c448909f5ef"
  key_pair        = openstack_compute_keypair_v2.git_keypair.name
  security_groups = [openstack_networking_secgroup_v2.win_sg.name]

  network {
    name = "ext-net1"
  }

  metadata = {
    classe = "TEST"
    module = "windows"
    projet = "GIT-LAB-CLOUD"
  }
}

output "vm_windows_ip" {
  value = openstack_compute_instance_v2.vm_windows_test.access_ip_v4
}
