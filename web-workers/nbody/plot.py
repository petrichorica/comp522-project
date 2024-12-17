import matplotlib.pyplot as plt

# Data
matrix_dims = [100, 200, 400, 800, 1000, 2000, 4000, 8000]

# Speedup values for each number of workers
speedup_rivertrail = [0.88, 0.93, 0.95, 0.97, 0.97, 1.02, 1.54, 3.14]
speedup_web_workers = [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.05, 3.75]

# Create the figure and axis
fig, ax = plt.subplots(figsize=(8, 6))

# Plot the lines
ax.plot(matrix_dims, speedup_rivertrail, marker='o', color='blue', label='RiverTrail')
ax.plot(matrix_dims, speedup_web_workers, marker='o', color='red', label='Web Workers with 4 workers')

# Add labels and title
ax.set_xlabel('Number of Particles')
ax.set_ylabel('Speedup')
ax.set_title('Speedup vs. Number of Particles for Different Implementations')

# Add grid and legend
ax.grid(True)
ax.legend()

# Show the plot
plt.tight_layout()
plt.show()
